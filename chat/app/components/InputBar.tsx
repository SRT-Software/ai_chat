'use client'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from "@/app/classes/ChatMessage";
import {useContext, useState,useEffect} from "react";
import {ChatContext, ChatInfo} from "@/app/context/chatContext";
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import StopIcon from '@mui/icons-material/Stop';
import Tooltip from '@mui/material/Tooltip'

const question = ['脚手架的操作规范', 
                '矿井内氧气含量过低怎么办', 
                '遭遇恶劣天气应该如何处理',
                '申报中国电力优质工程的条件',
                '安全质量部的工作是什么',
                '施工组织设计的编制的要求',
                '如何防止高处坠落事故',
                '人工挖孔桩的设计要求',
                '如何防止边坡坍塌',
                '塔机的尾部与周围建筑物及其外围施工设施之间的安全距离是多少',
                '如何防止缆索起重机起重伤害',
                '如何防止高压触电事故',
                '为了防止机械伤害事故，应采取哪些措施',
                '什么情况下严禁对已充油的变压器、电抗器的微小渗漏进行补焊',
                '如何防止燃油罐区火灾',
                '如何防止场内车辆伤害事故',
                '液氨储罐区的设置要求']

interface inputProps{
    readytosend?:boolean,
}

export default function InputBar(props:inputProps) {
    const {chatInfo, setChatInfo} = useContext(ChatContext);
    const [value, setValue] = useState('')
    const [alert,setAlert] = useState(false)
    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    const readytosend = props.readytosend

    const handleSend = ()=>{
        if(readytosend){
            console.log('send ', value)
            setChatInfo({
                ...chatInfo,
                Message: value,
            })
            setValue('')
        }
    }
    // @ts-ignore
    const handleKeyPress = (e)=>{
        if (e.key === "Enter") {
            handleSend();
        }
    }

    const getTips = ()=>{
        const num = 16;
        let index = Math.floor(Math.random() * (num + 1))
        setValue(question[index])
    }

    const clear = ()=>{
        setValue("")
    }


    const [speaking, setSpeaking] = useState(false)
    var recognition = new webkitSpeechRecognition();
    recognition.onaudioend = function(event){
        setSpeaking(false)
        recognition.stop()
    }
    recognition.interimResults = true;
    recognition.lang = "zh"
    recognition.onresult = function(event) {
        var result = event.results[event.results.length - 1][0].transcript;
        console.log("result:")
        console.log(result)
        setValue(result)
    };
    recognition.onerror = function(event){
        console.log(event)
    }
    const startSpeaking=()=>{
        setSpeaking(true)
        recognition.start()
    }
    const stopSpeaking=()=>{
        setSpeaking(false)
        recognition.abort()
    }

    if (typeof webkitSpeechRecognition !== 'undefined') {
        // 在这里使用 webkitSpeechRecognition 对象
        console.log(typeof webkitSpeechRecognition)
    } else {
    // 处理不支持语音识别的情况
    console.log("No")
    }

    return (
        <Paper
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 620,
                margin: 'auto',
                marginTop:'3vh',
                height:"7vh",
                border: '1px solid #ccc',
                borderRadius: '5px',
            }}
            elevation={0}
            onKeyDown={handleKeyPress}
        >  
            <Tooltip title="提示词" placement="top" arrow>
                <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={getTips}>
                    <TipsAndUpdatesIcon />
                </IconButton>
            </Tooltip>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="请输入内容"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={handleTextFieldChange}
                value={value}
            />
            {(value != null && value != "") ?
            <Tooltip title="清除" placement="top" arrow>
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={clear}>
                    <ClearIcon />
                </IconButton>
            </Tooltip>
            :null}
            {speaking
            ?<Tooltip title="停止" placement="top"  arrow>
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={stopSpeaking}>
                <StopIcon />
                </IconButton>
            </Tooltip>
            :<Tooltip title="语音" placement="top" arrow>
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={startSpeaking}>
                <KeyboardVoiceIcon />
                </IconButton>
            </Tooltip>}
            <Tooltip title="发送" placement="top" arrow>
                <IconButton disabled={!readytosend} type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSend}>
                    <SendIcon />
                </IconButton>
            </Tooltip>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
    );
}