import {useState} from 'react'
import { useSelector } from 'react-redux'
const DirectoryBar=(props)=>
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
    return(
        <div 
        onDragOver={ondragover}
        onDragLeave={ondragleave}
        draggable 
        className={isover?"DirectoryPath-object-over":"DirectoryPath-object"}>{props.type==2?'> ':null} {props.type==3?'➕':props.type==2?'🗂':props.type==1?'📝':'📁'} {props.title}</div>
    )
}
export default DirectoryBar