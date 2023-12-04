'use client'
import Tooltip from "@mui/material/Tooltip";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {Avatar, Button} from "@mui/material";
import axios from "axios";
import {BASEURL} from "@/app/config/configs";
import FileCard from "../components/FileCard";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import "regenerator-runtime/runtime";
export default function Home() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
    }
    return (
        <main>
            <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button onClick={()=>SpeechRecognition.startListening}>Start</button>
                <button onClick={()=>SpeechRecognition.stopListening}>Stop</button>
                <button onClick={()=>resetTranscript}>Reset</button>
            <p>{transcript}</p>
            </div>
        </main>
    )
}