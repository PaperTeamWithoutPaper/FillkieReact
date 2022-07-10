import { useState, useRef } from "react"
import useDrag from "./useDrag";
const Card=(props)=>
{
    const [ishover,setIshover]=useState(0)
   

    return(
        <div 
            style={{position: 'relative', }}
            className="Card-body" 
            onMouseOver={()=>{setIshover(1)}} 
            onMouseOut={()=>{setIshover(0)}}>
            <div className="Card-title">{props.type?'📝':'📁'} {props.title}</div>
            <div className={ishover?"Card-shadow-active":"Card-shadow-hidden"}></div>
            <div className={ishover?"Card-desc-active":"Card-desc-hidden"}>{props.desc}</div>
        </div>
    )
}
export default Card