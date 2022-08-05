import Card from "../../main/ProjectComponents/Card"
import {useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import './Drive.scss'
import ContextModal from "../../Modal/ContextModal"
import Loading from "../../Loading/Loading"
import { useParams } from "react-router"
import '../../FIleUpload/Upload.scss'
const Drive=()=>
{
    const [position,setPosition]=useState({x:0,y:0});
    const [isContext,setIsContext]=useState(0)
    const dirId=useSelector(state=>state.file_reducer.dirId)
    const files=useSelector((state)=>state.file_reducer.files)
    const file=files[dirId]

    const fileLoading=useSelector(state=>state.file_reducer.fileLoading)
    
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

    const ondrop=(e)=>
    
    {

        e.preventDefault();
        e.stopPropagation();
        console.log(e.dataTransfer.files);
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
    const {id}=useParams()
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
            <div style={{transition: 'all ease 0.3s', opacity:`${100-fileLoading*50}%`}}>
            <div className="Drive-flex" onMouseDown={()=>{setIsContext(0)}}>
                {file!=undefined?(file.map((data)=>{return(<Card pid={id} id={data.key} type={data.type} thumbnail={data.thumbnail} title={data.name} desc={data.desc}></Card>)})):null}
            </div>
            </div>
            
        </div>
    )
}
export default Drive