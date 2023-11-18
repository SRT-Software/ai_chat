import React, {useContext, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import ChatCard from "@/app/components/ChatCard";

import ChatMessage from "@/app/classes/ChatMessage";
import InputBar from "@/app/components/InputBar";
import {ChatContext, ChatProvider} from "@/app/context/chatContext";
import axios, {AxiosResponse} from "axios";
import {BASEURL} from "@/app/config/configs";


const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const {chatInfo, setChatInfo} = useContext(ChatContext)

    const chat_messages = chatHistory.map((Message, index) => {
        return (
            <ChatCard key={index} role={Message.role} content={Message.messages}/>
        )
    })

    useEffect(() => {
        if (chatInfo.Message !== ''){
            let newMessage = new ChatMessage('', chatInfo.Message, 'you')
            setChatHistory(chatHistory => [...chatHistory, newMessage])
            setChatInfo({
                ...chatInfo,
                Message: '',
            })
            const headers = { 'Token': 'test' };
            const data = { question: chatInfo.Message };
            axios.post(`${BASEURL}/api/data`, {
                headers: {
                    'Content-Type': 'application/json',
                    Token: 'test'
                },
                data: {
                    "question": chatInfo.Message
                }
            })
                .then((response: AxiosResponse) => {
                    console.log('Response:', response.data);
                })
                .catch((error: any) => {
                    console.error('Error:', error);
                });
        }
    }, [chatInfo.Message]);

    return (
        <>
            <Box sx={{
                height: '500px',
                width: '600px',
                overflow: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                display: 'block',
                marginLeft: '25%',
                marginTop: '2%',
            }}>
                {chat_messages}
            </Box>
            <InputBar/>
        </>
    );
};

export default Chat;