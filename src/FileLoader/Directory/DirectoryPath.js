import './DirectoryPath.scss'
import {useSelector,useDispatch} from 'react-redux'
import DirectoryBar from './DirectoryBar'
import { useEffect, useState, useCallback } from 'react'
import { setDirWidth } from '../../reducer/file_reducer'
import FileBar from './FileBar'
import { useParams } from 'react-router'
import { setCurDir,fileLoading,setFileInfo } from '../../reducer/file_reducer'
import { nodeAxios } from '../../apis/api'

const DirectoryPath=()=>
{
    const dispatch=useDispatch()
    
    const pathWidth=useSelector((state)=>state.file_reducer.width)
    const [dragging,setDragging]=useState(0)
    const {pid,id}=useParams()
    const files=useSelector(state=>state.file_reducer.files)
    const dirId=pid
    const file=files[dirId]
    const ondragstart=(e)=>
    {
        const img = new Image();
        e.dataTransfer.setDragImage(img, 0, 0);
        setDragging(1)
    }
    const setWidth=(e)=>
    {
        setDragging(1)
        if(e.clientX>130){
        dispatch(setDirWidth(e.clientX-50))
        }
    }
    const readFile=()=>
    {
        dispatch(setCurDir(pid))
    }
    return(
        <div className="DirectoryPath-body" style={{width:`${pathWidth+30}px`}}>
            <div 
                className={dragging?"DirectoryPath-dragbar-active":"DirectoryPath-dragbar"} 
                draggable 
                onDragStart={ondragstart} 
                onDrag={setWidth} 
                onMouseOver={()=>{setDragging(1)}}
                onMouseOut={()=>{setDragging(0)}}
                onDragEnd={()=>{setDragging(0)}}>
            </div>
            <div className="DirectoryPath-files">
                <div onClick={readFile} className="DirectoryPath-title">PROJECT1</div>
                {file!=undefined?file.map((e)=>{if(e.type==2){return(<DirectoryBar name={e.name} id={e.key} depth={0} title={e.name}></DirectoryBar>)}else{return(<FileBar name={e.name} key={e.key} depth={0} title={e.name}></FileBar>)}}):null}
            </div>
        </div>
    )
}
export default DirectoryPath