import React, {useContext, useEffect, useState, useRef} from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'
import axios,{AxiosResponse} from 'axios';
import { BASEURL } from '../config/configs';

interface FileProps{
    filename: string,
    refresh: ()=>void,
}

export default function FileCard(props:FileProps){
    const handleDelete = async()=>{
        const response = await axios.post(`${BASEURL}/file/delete`,{
            filename:props.filename
        },{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test',
            }
        })
        console.log(response)
        props.refresh()
    }

    return (
        <Card sx={{display:"flex"}}>
            <Typography variant='h6' sx={{ ml: 1, flex: 1 }}>{props.filename}</Typography>
            <IconButton sx={{p: '10px'}} color='error' onClick={handleDelete}><DeleteIcon/></IconButton>
        </Card>
    )
}
