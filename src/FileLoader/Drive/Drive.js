import Card from "../../main/ProjectComponents/Card"
import {useSelector} from 'react-redux'
import {useState} from 'react'
import './Drive.scss'
import ContextModal from "../../Modal/ContextModal"
const Drive=()=>
{
    const [position,setPosition]=useState({x:0,y:0});
    const [isContext,setIsContext]=useState(0)
    const files=useSelector((state)=>state.file_reducer.files)
    const getMouseXY=(e)=>
    {
        setPosition({x:e.clientX,y:e.clientY})
    }
    const createModal=(e)=>
    {
        setIsContext(1)
        e.preventDefault()
        document.addEventListener('contextmenu',getMouseXY)
    }
    
    return(
        <div className="Drive-box" onContextMenu={createModal} >
            <div className="Drive-bg" onMouseDown={()=>{setIsContext(0)}}></div>
            {isContext?<div style={{position:'absolute',left:`${position.x}px`,top:`${position.y}px`,zIndex:'3'}}><ContextModal></ContextModal></div>:null}
            <div className="Drive-flex">
                {files.map((data)=>{return(<Card type={data.type} thumbnail={data.thumbnail} title={data.title} desc={data.desc}></Card>)})}
            </div>
        </div>
    )
}
export default Drive