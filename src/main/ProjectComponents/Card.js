import { useState, useRef } from "react"
import useDrag from "./useDrag";
import {useDispatch} from 'react-redux';
import { IsCreateProject } from "../../reducer/project_reducer";
import { useNavigate } from "react-router";
const Card=(props)=>
{
    const [ishover,setIshover]=useState(0)
    const [isover,setIsover]=useState(0)
    const ondragover=()=>
    {
        setIsover(1)
    }
    const ondragleave=()=>
    {
        setIsover(0)
    }
    const dispatch=useDispatch();
    const navigate=useNavigate();
    return(
        <div 
            draggable={props.type!=3?'true':'false'}
            onDragOver={props.type!=3?ondragover: null}
            onDragLeave={props.type!=3?ondragleave:null}
            className={isover?"Card-body-over":"Card-body"}
            onMouseOver={()=>{setIshover(1)}} 
            onMouseOut={()=>{setIshover(0)}}
            onClick={()=>{if(props.type==3){dispatch(IsCreateProject(1))}
            if(props.type==4){navigate(`/board/${props.id}/${props.pid}`)}
            if(props.type==2){navigate(`/board/${props.id}/${props.pid}`)}
        }
            
        }
            onContextMenu={(e)=>{
                e.preventDefault();
                console.log('a')}}>
            <div className="Card-title">{props.type==3?'➕':props.type==4?'🗂':props.type==1?'📝':'📁'} {props.title}</div>
            <div className={ishover?"Card-shadow-active":"Card-shadow-hidden"}></div>
            <div className={ishover?"Card-desc-active":"Card-desc-hidden"}>{props.desc}</div>
        </div>
    )
}
export default Card