import {useState} from 'react'
const ModalButton=(props)=>
{
    const [ishover,setIshover]=useState(0)
    return (
        <div 
        onMouseOver={()=>{setIshover(1)}} 
        onMouseOut={()=>{setIshover(0)}}
        className={ishover?"Modal-menu-active":"Modal-menu-normal"}>
        {props.data}
        </div>
    )
}
export default ModalButton