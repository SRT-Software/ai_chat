'use client'
import ChatPage from "@/app/components/ChatPage";
import {ChatProvider} from "@/app/context/chatContext";
import React, { useState } from 'react'
import BackupIcon from '@mui/icons-material/Backup';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogTitle } from "@mui/material";
import FileDialog from "./components/FileDialog";


export default function Home() {

    return (
        <main>
            
            <ChatProvider>
                <ChatPage/>
            </ChatProvider>
            <FileDialog/>
        </main>
    )
}
