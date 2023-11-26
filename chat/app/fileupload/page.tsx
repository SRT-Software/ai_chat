'use client'
import exp from "constants";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import axios from "axios";
import {BASEURL} from "@/app/config/configs";
import { MuiFileInput } from 'mui-file-input'
import { Box, InputAdornment } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';

export default function FilePage(){
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
        <main style={{display:"flex",justifyContent:"center"}}>
                <MuiFileInput
                value={value}
                onChange={handleChange}
                hideSizeText
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <BackupIcon/>
                        </InputAdornment>
                    ),
                }}
                placeholder="点击选择文件或拖动文件到此处"
                />
        </main>
    )
}