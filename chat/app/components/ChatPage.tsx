import React, {useContext, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import ChatCard from "@/app/components/ChatCard";

import ChatMessage from "@/app/classes/ChatMessage";
import InputBar from "@/app/components/InputBar";
import {ChatContext, ChatProvider} from "@/app/context/chatContext";
import axios, {AxiosResponse} from "axios";
import {BASEURL} from "@/app/config/configs";
interface PostData {
    question: string
}

interface PostHeaders{
    Token: string
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const {chatInfo, setChatInfo} = useContext(ChatContext)
    const [stream, setStream] = useState(false)

    useEffect(() => {
        if (chatInfo.Message !== ''){
            let newMessage = new ChatMessage('', chatInfo.Message, 'you')
            setChatHistory(chatHistory => [...chatHistory, newMessage])
            let newMessage2 = new ChatMessage('', '', 'assistant')
            setChatHistory(chatHistory => [...chatHistory, newMessage2])
            setStream(true)
        }
    }, [chatInfo.Message]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(chatInfo.Message)
                const response = await fetch(`${BASEURL}/api/data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer test',
                    },
                    body: JSON.stringify({
                        question: chatInfo.Message
                    }),
                });

                const stream = response.body;

                // @ts-ignore
                const reader = stream.getReader();
                let result = '';

                const processStream = async () => {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            break;
                        }

                        const chunk = new TextDecoder().decode(value);
                        result += chunk;
                        setChatHistory(chatHistory => {
                            const newHistory = [...chatHistory];
                            const lastElement = newHistory[newHistory.length - 1];
                            lastElement.messages = result;
                            return newHistory;
                        })
                    }
                };

                processStream();
            } catch (error) {
                console.error(error);
            }
        };
        if(chatHistory.length !== 0){
            fetchData();
            setStream(false)
            setChatInfo({
                ...chatInfo,
                Message: ''
            })
        }
    }, [stream]);

    const chat_messages = chatHistory.map((Message, index) => {
        console.log("message: ", Message.messages)
        return (
            <ChatCard key={index} role={Message.role} content={Message.messages}/>
        )
    })

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