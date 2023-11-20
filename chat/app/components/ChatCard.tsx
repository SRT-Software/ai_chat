import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {Avatar} from "@mui/material";
import {width} from "@mui/system";
import Divider from '@mui/material/Divider';
import {useEffect, useState} from "react";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { pink, yellow } from '@mui/material/colors';
import FaceIcon from '@mui/icons-material/Face';

interface ChatProps {
    // 可选的属性
    role: string,
    content: string,
}

function ChatCard(props: ChatProps) {
    const theme = useTheme();
    const [roleText, setRoleText] = useState(props.role === 'assistant' ? "AI助手": "您")
    const [content, setContent] = useState(props.content)
    const flex1 = props.role === 'assistant' ? {justifyContent: 'flex-start'}: {justifyContent: 'flex-end'}
    const bgcolor = props.role === 'assistant' ? "#F5F5F5": "#4169E1"
    const fontcolor = props.role === 'assistant' ? "black": "white"
    useEffect(() => {
        setContent(props.content)
    }, [props.content]);
    return (
        <>
            <Box sx={{
                display: 'flex' ,
                height: 'auto',
                marginTop: '10px',
                
            }} style={flex1}>
                {props.role === 'assistant'?<SmartToyIcon sx={{ color: pink[500], fontSize:"30px" }}/>:<FaceIcon sx={{ color: yellow[900],fontSize:"30px" }}/>}
                <Typography component="div" variant="h6" fontWeight={"bold"} sx={{marginLeft: "1%"}}>
                    {roleText}
                </Typography>
            </Box>
            <Box sx={{display: 'flex'}} style={flex1}>
                <Card sx={{
                    
                    display: 'inline-block' ,
                    width:'auto',
                    marginTop: '10px',
                    bgcolor: `${bgcolor}`,
                    maxWidth:"100%",
                }} style={flex1}>
                    <Box >
                        <CardContent sx={{ flex: '1' }}>
                            <Typography component="div" variant="body1" style={{color: `${fontcolor}` }}>
                                {content}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </Box>
            <Divider/>
        </>
    );
}

export default ChatCard