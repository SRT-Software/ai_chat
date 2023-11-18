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
import {useState} from "react";

interface ChatProps {
    // 可选的属性
    role: string,
    content: string,
}

function ChatCard(props: ChatProps) {
    const theme = useTheme();
    const [roleText, setRoleText] = useState(props.role === 'assistant' ? "AI助手": "您")
    const [content, setContent] = useState(props.content)
    return (
        <>
            <Box sx={{
                display: 'flex' ,
                height: 'auto',
            }}>
                <Avatar sx={{width: "20px", height: "20px"}}/>
                <Typography component="div" variant="body2" sx={{marginLeft: "1%"}}>
                    {roleText}
                </Typography>
            </Box>
            <Box>
                <Card sx={{
                    display: 'flex' ,
                    height: 'auto',
                }}>
                    <Box >
                        <CardContent sx={{ flex: '1' }}>
                            <Typography component="div" variant="body1">
                                {content}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </Box>
        </>
    );
}

export default ChatCard