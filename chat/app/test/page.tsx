'use client'
import Tooltip from "@mui/material/Tooltip";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {Avatar, Button} from "@mui/material";
import axios from "axios";
import {BASEURL} from "@/app/config/configs";
import FileCard from "../components/FileCard";
export default function Home() {
    const [value,setValue] = useState("")
    const fileInputRef = useRef(null);
    const handleClick = async () => {
        // @ts-ignore
        console.log("click")
        let r = await axios.post(`${BASEURL}/file/audio`, {
            "text": "你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色，在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人——同时，逐步发掘「原神」的真相"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test',
            },
        })
        console.log(r)
    };

    return (
        <main>
        </main>
    )
}