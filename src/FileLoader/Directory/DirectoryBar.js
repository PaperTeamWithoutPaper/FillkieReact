import {useState} from 'react'
const DirectoryBar=(props)=>
{
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
        onDragOver={ondragover}
        onDragLeave={ondragleave}
        draggable 
        className={isover?"DirectoryPath-object-over":"DirectoryPath-object"}>{props.title}</div>
    )
}
export default DirectoryBar