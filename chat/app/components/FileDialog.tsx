'use client'
import exp from "constants";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import axios,{AxiosResponse} from "axios";
import {BASEURL} from "@/app/config/configs";
import { MuiFileInput } from 'mui-file-input'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, SpeedDial, SpeedDialAction, SpeedDialIcon, Snackbar, Alert, TextField, Tooltip, IconButton } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import FolderIcon from '@mui/icons-material/Folder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FileCard from "./FileCard";
import {useSpeechRecognition} from "react-speech-recognition";


export default function FileDialog(){
    const [file, setFile] = React.useState<File | null>(null)

    const handleChange = (newValue: File | null) => {
        if(newValue !== null){
            if(newValue.type === "application/pdf"){
                setFile(newValue)
            }else{
                setFileError(true)
                setFile(null)
            }
            return
        }
        setFile(newValue)
    }

    const [openfile,setOpenFile] = useState(false)
    const [openvoice,setOpenVoice] = useState(false)
    const [openfilelist,setOpenFileList] = useState(false)
    const [opensuccess,setOpenSuccess] = useState(false)
    const [openfail,setOpenfail] = useState(false)
    
    const actions = [
        { icon: <BackupIcon color="primary"/>, name: '上传文件', action: ()=>{setOpenFile(true)}},
        {icon:< KeyboardVoiceIcon color="primary"/>,name:"语音上传",action:()=>{setOpenVoice(true)}},
        {icon:<ListAltIcon color='primary'/>,name:"文件列表",action:()=>{setOpenFileList(true)}}
      ];

    async function handleFileOk() {
        try{
            if(file === null || file === undefined){
                setFileNull(true)
            }else{
                setOpenFile(false)
                console.log(file)
                let formData = new FormData();
                formData.append('file', file)
                let r = await axios.post(`${BASEURL}/file/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer test',
                    },
                })
                if(r.status == 200){
                    setOpenSuccess(true)
                    getFileList()
                }else{
                    setOpenfail(true)
                }
                console.log(r)
            }
        }catch(e){
            console.error(e)
        }
    }

    async function handleVoiceOk(){
        try{
            if(text === null || text === "" || text === undefined){
                setVoiceNull(true)
            }else{
                setOpenVoice(false)
                let r = await axios.post(`${BASEURL}/file/audio`, {
                    "text": text
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer test',
                    },
                })
                if(r.status == 200){
                    setVoiceSuccess(true)
                    getFileList()
                }else{
                    setVoiceFail(true)
                }
                console.log(r)
            }
        }catch(e){
            console.error(e)
        }
        
    }
    const handleFileListOK = ()=>{
        setOpenFileList(false)
    }

    const [fileerror,setFileError] = useState(false)
    const [filenull,setFileNull] = useState(false)
    const [voicenull,setVoiceNull] = useState(false)
    const [voicesuccess,setVoiceSuccess] = useState(false)
    const [voicefail,setVoiceFail] = useState(false)
    const [text,setText] = useState("")
    const [speaking, setSpeaking] = useState(false)
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();
    const startListening=()=>{
        if (listening) {
            stopSpeechRecognition();
        } else {
            startSpeechRecognition();
        }
    }

    const startSpeechRecognition = () => {
        resetTranscript();
        setSpeaking(true);
    };

    const stopSpeechRecognition = () => {
        setSpeaking(false);
    };

    const [filelist, setFileList] = useState(<Box/>)

    const getFileList = async()=>{
        const response = await axios.get(`${BASEURL}/file/getfiles`,{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test',
            }
        })
        console.log(response.data)
        const newlist = response.data.filenames.map((filename:string,index:number)=>{
            return(
                <FileCard key={index} filename={filename} refresh={getFileList}/>
            )
        })
        setFileList(<Box>{newlist}</Box>)
    }

    useEffect(()=>{
        getFileList()
        if (browserSupportsSpeechRecognition) {
            console.log('Speech recognition supported');
        }
    },[])

    return (
        <Box>
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: "15vh", right:'10%' }}
            icon={<FolderIcon /> }
            FabProps={{
                size: 'large',
            }}
        >
            {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
            />
            ))}
        </SpeedDial>
            {openfile && <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} open={openfile}>
                <DialogTitle>上传文件</DialogTitle>
                <DialogContent>
                    <Box sx={{display:"inline-block",margin:"auto",width:"100%"}}>
                        <MuiFileInput
                        value={file}
                        onChange={handleChange}
                        style={{width:"100%"}}
                        hideSizeText
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BackupIcon/>
                                </InputAdornment>
                            ),
                        }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={()=>setOpenFile(false)}>
                    取消
                    </Button>
                    <Button onClick={handleFileOk}>确定</Button>
                </DialogActions>
            </Dialog>}
            {openvoice && 
            <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} open={openvoice}>
                <DialogTitle>输入条目</DialogTitle>
                <DialogContent>
                    <TextField multiline sx={{width:"100%",maxHeight:"200px",overflow:"auto"}} value={text} onChange={(e)=>setText(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={()=>setOpenVoice(false)}>
                    取消
                    </Button>
                    <Button onClick={handleVoiceOk}>确定</Button>
                </DialogActions>
                <Box sx={{display:"block",position:"absolute",bottom:"5%",left:"5%"}}>
                <Tooltip title="语音输入" placement="top" arrow>
                    <IconButton type="button" aria-label="search" onClick={startListening}>
                        <KeyboardVoiceIcon  color={speaking?'primary':'inherit'}/>
                    </IconButton>
                </Tooltip>
                </Box>
            </Dialog>}
            {openfilelist && 
            <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} open={openfilelist}>
                <DialogTitle>已上传文件</DialogTitle>
                <DialogContent>
                    {filelist}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFileListOK}>确定</Button>
                </DialogActions>
            </Dialog>
            }
            <Snackbar open={fileerror} onClose={()=>setFileError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="warning">只能上传pdf文件</Alert>
            </Snackbar>
            <Snackbar open={filenull} onClose={()=>setFileNull(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="warning">请先选择文件</Alert>
            </Snackbar>
            <Snackbar open={opensuccess} onClose={()=>setOpenSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="success">文件上传完毕</Alert>
            </Snackbar>
            <Snackbar open={openfail} onClose={()=>setOpenfail(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="error">文件上传失败</Alert>
            </Snackbar>
            <Snackbar open={voicenull} onClose={()=>setVoiceNull(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="warning">请先输入内容</Alert>
            </Snackbar>
            <Snackbar open={voicesuccess} onClose={()=>setVoiceSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="success">条目上传完毕</Alert>
            </Snackbar>
            <Snackbar open={voicefail} onClose={()=>setVoiceFail(false)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="error">条目上传失败</Alert>
            </Snackbar>
        </Box>
    )
}