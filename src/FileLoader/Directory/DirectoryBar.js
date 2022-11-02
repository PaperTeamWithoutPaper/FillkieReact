import {useEffect, useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import FileBar from './FileBar'
import { nodeAxios } from '../../apis/api'
import { setFileInfo,setCurDir,fileLoading } from '../../reducer/file_reducer'
const DirectoryBar=(props)=>
{
    const {id,pid}=useParams()
    const files=useSelector(state=>state.file_reducer.files)
    const dirId=props.id
    const file=files[dirId]
    const width=useSelector((state)=>state.file_reducer.width)
    const [ishover,setIshover]=useState(0)
    const [isover,setIsover]=useState(0)
    const [isclicked, setIsclicked]=useState(-1)
    const dispatch=useDispatch()
    const ondragover=()=>
    {
        setIsover(1)
    }
    const ondragleave=()=>
    {
        setIsover(0)
    }
    const readInnerFile=()=>
    {
        nodeAxios.get(`/dir?projectId=${id}&folderId=${props.id}`).then((response)=>{
            
            dispatch(setFileInfo(props.id,response.data.data));
        })
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
                    onClick={()=>{setIsclicked(isclicked*(-1));readInnerFile()}}
           
                    >
                    
                    <img style={{marginLeft:`${props.depth*10}px`}} className={isclicked==-1?"DirectoryPath-folder-arrow-normal":"DirectoryPath-folder-arrow-clicked"} src={require('./icon/arrow.png')}></img>
                    {<div>📁</div>} 
                    <div style={{marginLeft:'5px'}}>{props.title}</div>
                </div>
            {file!=undefined?(file.map((e)=>{if(e.type==2 && isclicked==1){return(<DirectoryBar name={e.name} title={e.name} id={e.key} depth={props.depth+1} ></DirectoryBar>)}else if(isclicked==1){return(<FileBar name={e.name} title={e.name} id={e.key} depth={props.depth+1} ></FileBar>)}})):null}
            </div>
        </div>
    )
}
export default DirectoryBar