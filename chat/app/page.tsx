'use client'
import ChatPage from "@/app/components/ChatPage";
import {ChatProvider} from "@/app/context/chatContext";
import React, { useState } from 'react'
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
