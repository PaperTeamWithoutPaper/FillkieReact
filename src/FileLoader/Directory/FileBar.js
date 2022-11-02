import {useState} from 'react'
import { useSelector } from 'react-redux'
const FileBar=(props)=>
{
    const width=useSelector((state)=>state.file_reducer.width)
    const [ishover,setIshover]=useState(0)
    const [isover,setIsover]=useState(0)
    const getIcon=()=>
    {

        if(props.name.slice(-5)=='.json')
            return '📝'
        if(props.name.slice(-4)=='.png' || props.name.slice(-4)=='.jpg')
            return '🏞'

        
    }
    return(
        <div className="DirectoryPath-file-box">
            <div 
                style={{width:`${width+20}px`}}

                draggable 
                className={isover?"DirectoryPath-object-over":"DirectoryPath-object"}>   
                <div className="DirectoryPath-object-desc-box" style={{paddingLeft:`${props.depth*10}px`}}>
                    {<div>{getIcon()}</div>} 
                    <div style={{marginLeft:'5px'}}>{props.title}</div>
                </div>
            </div>
        </div>
    )
}
export default FileBar