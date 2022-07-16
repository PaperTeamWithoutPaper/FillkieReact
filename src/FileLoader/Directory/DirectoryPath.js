import './DirectoryPath.scss'
import {useSelector,useDispatch} from 'react-redux'
import DirectoryBar from './DirectoryBar'
import { useEffect, useState, useCallback } from 'react'
import { setDirWidth } from '../../reducer/file_reducer'
const DirectoryPath=()=>
{
    const dispatch=useDispatch()
    const files=useSelector((state)=>state.file_reducer.files)
    const pathWidth=useSelector((state)=>state.file_reducer.width)
    const [dragging,setDragging]=useState(0)
    const ondragstart=(e)=>
    {
        const img = new Image();
        e.dataTransfer.setDragImage(img, 0, 0);
        setDragging(1)
    }
    const setWidth=(e)=>
    {
        setDragging(1)
        if(e.clientX>100){
        dispatch(setDirWidth(e.clientX-25))
        }
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
                onDragEnd={()=>{setDragging(0)}}
            ></div>
            <div className="DirectoryPath-files">
                <div className="DirectoryPath-title">PROJECT1</div>
                {files.map((e)=>{return(<DirectoryBar type={e.type} title={e.title}></DirectoryBar>)})}
            </div>
        </div>
    )
}
export default DirectoryPath