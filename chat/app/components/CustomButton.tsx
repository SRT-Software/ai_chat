import React from "react";
import './styles.css'
import LockIcon from '@mui/icons-material/Lock'
import Link from "next/link";

export type CSSProps = {
    bg: string;
    bg_hover: string;
    text_color: string;
    text: string;
    icon?: boolean;
    href?: string;
    disabled?: boolean;
    roomId?: string;
};
function CustomButton(props: CSSProps){
    const disabledCSS = props.disabled ? "disabled-link" : "";
    const classCSS:string = `cursor-pointer text-base py-1 px-3 text-sm custom-solid-box-shadow-sm border-2 ${props.bg} hover:${props.bg_hover} ${props.text_color} transition-colors hover:custom-solid-box-shadow-hover rounded-full items-center font-bold border-black block ${disabledCSS}`
    const text = props.text;
    const disabled = props.disabled;
    const roomId = props.roomId === undefined ? '' : props.roomId;
    const href = props.href === undefined ? '' : `${props.href}/${roomId}/`;
    if(href === undefined){
        return(
            <div className="mr-3">
                {disabled && <LockIcon style={{marginLeft: "75px",marginTop:"2px",position:"fixed",color:"grey"}}/>}
                <div>
                    <a className = {classCSS}
                    >
                        {text}
                    </a>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="mr-3">
                {disabled && <LockIcon style={{marginLeft: "75px",marginTop:"2px",position:"fixed",color:"grey"}}/>}
                <div>
                    <Link className = {classCSS}
                          href={href}
                    >
                        {text}
                    </Link>
                </div>
            </div>
        )
    }
}

export default CustomButton