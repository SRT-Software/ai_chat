'use client'
import * as React from 'react';
import { Button,Card } from "@mui/material";
import {useState} from 'react'

export default function Home() {
    const [value,setValue] = useState("")
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "zh"
    recognition.onresult = function(event) {
        var result = event.results[event.results.length - 1][0].transcript;
        console.log("result:")
        console.log(result)
        setValue(result)
    };
    recognition.onerror = function(event){
        console.log(event)
    }
    return (
        <main>
            <Button onClick={()=>recognition.start()}>speak</Button>
            <Card>{value}</Card>
        </main>
    )
}