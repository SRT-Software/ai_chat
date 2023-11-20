import React, {useContext, useEffect, useState, useRef} from 'react';
import Box from "@mui/material/Box";
import ChatCard from "@/app/components/ChatCard";

import ChatMessage from "@/app/classes/ChatMessage";
import InputBar from "@/app/components/InputBar";
import {ChatContext, ChatProvider} from "@/app/context/chatContext";
import axios, {AxiosResponse} from "axios";
import {BASEURL} from "@/app/config/configs";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface PostData {
    question: string
}

interface PostHeaders{
    Token: string
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const primarymessage = new ChatMessage('', "你好！我是ai问答助手，很高兴为您提供帮助。请问您有什么问题需要我解答？",'assistant')
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([primarymessage]);
    const {chatInfo, setChatInfo} = useContext(ChatContext)
    const [stream, setStream] = useState(false)
    const [textList, setTextList] = useState([])
    const [sourceList, setSourceList] = useState([])

    useEffect(() => {
        if (chatInfo.Message !== ''){
            setTextList([])
            setSourceList([])
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
                            if(result != ''){
                                axios.get(`${BASEURL}/api/source`, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer test',
                                    },
                                }).then(response => {
                                    // 处理响应数据
                                    setTextList(response.data.texts)
                                    setSourceList(response.data.sources)
                                    console.log(response.data);
                                }).catch(error => {
                                    // 处理请求错误
                                    console.error(error);
                                });
                            }
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

                await processStream();
                return
            } catch (error) {
                console.error(error);
            }
        };
        if(chatHistory.length !== 0){
            fetchData()
            setStream(false)
            setChatInfo({
                ...chatInfo,
                Message: ''
            })
        }
    }, [stream]);

    const chat_messages = chatHistory.map((Message, index) => {
        return (
            <ChatCard key={index} role={Message.role} content={Message.messages}/>
        )
    })

    const messagesEnd = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        // console.log("bottom")
        if (messagesEnd && messagesEnd.current) {
            messagesEnd.current.scrollTop = messagesEnd.current.scrollHeight;
        }
    };

    const textAccordions = textList.map((text, index) => {
        let title = `${sourceList[index]}`
        return (
            <Accordion key={index}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {text}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        )
    })


    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <div style={{backgroundColor:"#F5F5F5"}}>
            <Typography variant='h2' fontWeight={"bold"} gutterBottom><center>AI问答</center></Typography>
            <Box sx={{
                height: '500px',
                width: '600px',
                overflow: 'auto',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                display: 'block',
                margin: 'auto',
                bgcolor:"white",
            }} 
            ref={messagesEnd}
            >
                {chat_messages}
                {(textList.length != 0) &&<Accordion key={'files'}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>参考文献</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {textAccordions}
                    </AccordionDetails>
                </Accordion>}
                {/* <Accordion key={'files'}>
                <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>参考文献</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {textAccordions}
                    </AccordionDetails>
                </Accordion> */}
            </Box>
            <InputBar />
        </div>
    );
};

export default Chat;