import {useState} from 'react'
import { useSelector } from 'react-redux'
const DirectoryBar=(props)=>
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
        <div 
            style={{
                width:`${width+20}px`
            }}
            onDragOver={ondragover}
            onDragLeave={ondragleave}
            draggable 
            className={isover?"DirectoryPath-object-over":"DirectoryPath-object"}>
            
            <div className="DirectoryPath-object-desc-box">
                
                {props.type==2?<img className="DirectoryPath-folder-arrow" src={require('./icon/arrow.png')}></img>:null} 
                {props.type==3?'➕':props.type==2?<div>📁</div>:props.type==1?<div>📝</div>:<div>🗂</div>} 
                <div style={{marginLeft:'5px'}}>{props.title}</div>
            </div>
        </div>
    )
}
export default DirectoryBar