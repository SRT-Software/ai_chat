'use client'
import "regenerator-runtime/runtime";
import Tooltip from "@mui/material/Tooltip";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import { Alert, CircularProgress, LinearProgress, Snackbar } from "@mui/material";

export default function Home() {
    


    return (
        <main>
            <Snackbar open={true}  anchorOrigin={{ vertical: 'top', horizontal: 'left' }} >
                <Alert severity="info">wenjfjdskfd<LinearProgress /></Alert>
            </Snackbar>
            {/* <Snackbar open={true} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                <Alert severity="success">文件上传完毕</Alert>
            </Snackbar> */}
        </main>
    )
}