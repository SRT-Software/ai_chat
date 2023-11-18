import React, { useState } from 'react';
import Box from "@mui/material/Box";
import ChatCard from "@/app/components/ChatCard";

interface ChatProps {
    // 可选的属性
    title?: string;
}

const Chat: React.FC<ChatProps> = ({ title }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const handleSendMessage = () => {
        // 发送消息的逻辑
        if (message.trim() !== '') {
            setChatHistory([...chatHistory, message]);
            setMessage('');
        }
    };

    return (
        <>
            <Box sx={{
                height: '100%',
                width: '100%',
                overflow: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
            }}>
                <ChatCard/>
            </Box>
        </>
    );
};

export default Chat;