import {useState} from 'react'
import { useSelector } from 'react-redux'
import FileBar from './FileBar'
const DirectoryBar=(props)=>
{
    const files=props.files
    const width=useSelector((state)=>state.file_reducer.width)
    const [ishover,setIshover]=useState(0)
    const [isover,setIsover]=useState(0)
    const [isclicked, setIsclicked]=useState(-1)
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
            className={ishover?"DirectoryPath-box-hover":"DirectoryPath-box"}
            > 
            <div className="DirectoryPath-file-box"
                style={{width:`${width+20}px`}}
                className={isover?"DirectoryPath-object-over":"DirectoryPath-object"}>
                <div 
                    onDragOver={ondragover}
                    onDragLeave={ondragleave}
                    draggable
                    className="DirectoryPath-object-desc-box"
                    onClick={()=>{setIsclicked(isclicked*(-1))}}>
                    <img style={{marginLeft:`${props.depth*10}px`}} className={isclicked==-1?"DirectoryPath-folder-arrow-normal":"DirectoryPath-folder-arrow-clicked"} src={require('./icon/arrow.png')}></img>
                    {<div>📁</div>} 
                    <div style={{marginLeft:'5px'}}>{props.title}</div>
                </div>
            {files.map((e)=>{if(e.type==2 && isclicked==1){return(<DirectoryBar files={e.child} key={e.key} depth={props.depth+1} title={e.title}></DirectoryBar>)}else if(isclicked==1){return(<FileBar depth={props.depth+1} title={e.title}></FileBar>)}})}
            </div>
        </div>
    )
}
export default DirectoryBar