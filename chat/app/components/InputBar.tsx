import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from "@/app/classes/ChatMessage";
import {useContext, useState} from "react";
import {ChatContext, ChatInfo} from "@/app/context/chatContext";

export default function InputBar() {
    const {chatInfo, setChatInfo} = useContext(ChatContext);
    const [value, setValue] = useState('')
    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleSend = ()=>{
        console.log('send ', value)
        setChatInfo({
            ...chatInfo,
            Message: value,
        })
        setValue('')
    }
    const handleKeyPress = (e)=>{
        if (e.key === "Enter") {
            handleSend();
          }
    }


    return (
        <Paper
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 620,
                margin: 'auto',
                marginTop:'20px',
            }}
            onKeyDown={handleKeyPress}
        >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
                <MenuIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="请输入内容"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={handleTextFieldChange}
                value={value}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSend}>
                <SendIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
    );
}