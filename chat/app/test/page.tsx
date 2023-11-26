'use client'
import Tooltip from "@mui/material/Tooltip";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {Avatar, Button} from "@mui/material";
import axios from "axios";
import {BASEURL} from "@/app/config/configs";
export default function Home() {
    const [value,setValue] = useState("")
    const fileInputRef = useRef(null);
    const handleClick = () => {
        // @ts-ignore
        fileInputRef.current.click();
    };
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore

        const file = event.target.files[0];
        console.log(file)
        if(file !== undefined){
            let formData = new FormData();
            formData.append('file', file)
            // 在这里处理选择的文件
            let r = await axios.post(`${BASEURL}/file/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer test',
                },
            })
            console.log(r)
        }
    };
    return (
        <main>
            <Tooltip title="Click to Change" arrow>
                <div>
                    <Avatar onClick={handleClick}/>
                    <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange}/>
                </div>
            </Tooltip>
        </main>
    )
}