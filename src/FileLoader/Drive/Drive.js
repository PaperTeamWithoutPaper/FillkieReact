import Card from "../../main/ProjectComponents/Card"
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import './Drive.scss'
import ContextModal from "../../Modal/ContextModal"
import Loading from "../../Loading/Loading"
import { useParams } from "react-router"
import '../../FIleUpload/Upload.scss'
import { nodeAxios } from "../../apis/api"
import { setFileInfo,fileLoading } from "../../reducer/file_reducer"
const Drive=()=>
{
    const {id}=useParams()
    const [position,setPosition]=useState({x:0,y:0});
    const [isContext,setIsContext]=useState(0)
    const dirId=useSelector(state=>state.file_reducer.dirId)
    const files=useSelector((state)=>state.file_reducer.files)
    const file=files[dirId]

    const fileLoadingVal=useSelector(state=>state.file_reducer.fileLoadingVal)
    
    const getMouseXY=(e)=>
    {
        setPosition({x:e.clientX,y:e.clientY})
    }
    const createModal=(e)=>
    {
        e.preventDefault()
        setIsContext(1)
    
        document.addEventListener('contextmenu',getMouseXY)
    }
    /////drag/////
    const [dragging,setDragging]=useState(0)
    const [over,setOver]=useState(0)
    const dispatch=useDispatch()
    const ondrop=(e)=>
    
    {
        e.preventDefault();
        e.stopPropagation();
        if(e.dataTransfer.items.length!==0){
        dispatch(fileLoading(1))
        console.log(e.dataTransfer.files[0])
        var formData = new FormData();
        var dropFile=e.dataTransfer.files[0]

        formData.append("projectId",id)
        formData.append("folderId",dirId)
        formData.append("file",dropFile,encodeURIComponent(dropFile.name))

        nodeAxios.post('/upload',formData).then((response)=>{
            
            nodeAxios.get(`/dir?projectId=${id}&folderId=${dirId}`).then((response)=>{
                dispatch(setFileInfo(dirId,response.data.data));
                dispatch(fileLoading(0))

               })
        })
    }
        setOver(0)
        
    }
    const ondragover=(e)=>
    {
        e.preventDefault();
        if(e.dataTransfer.items.length!==0){
        setOver(1)
        }
    }
    const ondragout=(e)=>
    {
        setOver(0)
    }
    
    return(
        <div className="Drive-box"
        onContextMenu={createModal} 
        onDragStart={ondragstart}
        onDrop={ondrop}
        onDragOver={ondragover}
        onDragLeave={ondragout}
        >
           
           <div className={over?"upload-icon-box-active":'upload-icon-box-unactive'}>
               <img className="upload-image" src={require('../../FIleUpload/Icon/upload.png')} ></img>
               <div className="upload-desc" >Drop Here</div>
            </div>
        
            <div className="Drive-bg"></div>
            {isContext?<div style={{position:'absolute',left:`${position.x}px`,top:`${position.y-70}px`,zIndex:'3'}}><ContextModal></ContextModal></div>:null}
            <div style={{transition: 'all ease 0.3s', opacity:`${100-fileLoadingVal*50}%`}}>
            <div className="Drive-flex" onMouseDown={()=>{setIsContext(0)}}>
                {file!=undefined?(file.map((data)=>{return(<Card name={data.name} pid={id} id={data.key} type={data.type} thumbnail={data.thumbnail} title={data.name} desc={data.desc}></Card>)})):null}
            </div>
            </div>
            
        </div>
    )
}
export default Drive