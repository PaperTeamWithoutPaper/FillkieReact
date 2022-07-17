import {useState} from 'react'
import { useSelector } from 'react-redux'
const FileBar=(props)=>
{
    const width=useSelector((state)=>state.file_reducer.width)
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
        <div className="DirectoryPath-box">
        <div 
            style={{
                width:`${width+20}px`
            }}
            onDragOver={ondragover}
            onDragLeave={ondragleave}
            draggable 
            className={isover?"DirectoryPath-object-over":"DirectoryPath-object"}>   
            <div className="DirectoryPath-object-desc-box" style={{paddingLeft:`${props.depth*10}px`}}>
                {<div>📝</div>} 
                <div style={{marginLeft:'5px'}}>{props.title}</div>
            </div>
        </div>
        </div>
    )
}
export default FileBar