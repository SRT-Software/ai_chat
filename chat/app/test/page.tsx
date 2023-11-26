'use client'
import Tooltip from "@mui/material/Tooltip";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {Avatar, Button} from "@mui/material";
import axios from "axios";
import {BASEURL} from "@/app/config/configs";
import { MuiFileInput } from 'mui-file-input'
import FileUploadIcon from '@mui/icons-material/FileUpload';

export default function Home() {
    const [value, setValue] = React.useState<File | null>(null)

    const handleChange = (newValue: File | null) => {
        if(newValue !== null){
            if(newValue.type === "application/pdf"){
                setValue(newValue)
            }
            return
        }
        setValue(newValue)
    }

    return (
        <main>
            
            <MuiFileInput
            value={value}
            onChange={handleChange}
            hideSizeText
            />
        </main>
    )
}