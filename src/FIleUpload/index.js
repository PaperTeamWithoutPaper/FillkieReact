import {useState,useRef} from 'react'
import './Icon/upload.png'
import './Upload.scss'
const FileUpload=()=>
{
    const [dragging,setDragging]=useState(0)
    const [over,setOver]=useState(0)
    const dragRef=useRef(null)
    const ondrop=(e)=>
    
    {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.dataTransfer.files);
        setOver(0)
    }
    const ondragover=(e)=>
    {
        setOver(1)
        e.preventDefault();
        e.stopPropagation();
    }
    const ondragout=(e)=>
    {
        setOver(0)
    }
    return(
        
  
      
        <div 
        
        onDrop={ondrop}
        onDragOver={ondragover}
        onDragLeave={ondragout}
        className="upload-body">
           
           <div className={over?"upload-icon-box-active":'upload-icon-box-unactive'}>
               <img className="upload-image" src={require('./Icon/upload.png')} ></img>
               <div className="upload-desc" >Drop Here</div>
               </div>
        </div>

    )
}
export default FileUpload