'use client'
import "regenerator-runtime/runtime";
import Tooltip from "@mui/material/Tooltip";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Home() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        console.log("not support")
    }

    useEffect(() => {
        console.log(transcript)
    }, [transcript]);

    const startListenning = async () =>{
        await SpeechRecognition.startListening({ language: 'zh-CN' })
        console.log("start")
    }

    const endListenning = async () =>{
        await SpeechRecognition.stopListening()
        console.log("end")
    }


    return (
        <main>
            <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button onClick={startListenning}>Start</button>
                <button onClick={endListenning}>Stop</button>
                <button onClick={()=>{
                    resetTranscript()
                    console.log("reset")
                }}>Reset</button>
            <p>{transcript}</p>
            </div>
        </main>
    )
}