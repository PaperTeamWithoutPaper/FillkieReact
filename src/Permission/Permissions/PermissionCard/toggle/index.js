import './toggle.scss'
import { useState } from 'react'
const ToggleBar=()=>
{
    const [val,setVal]=useState(1)
    return (
        <div onClick={()=>{setVal(val*(-1))}} className={val===1?"toggle-box-active":"toggle-box-unactive"}>
            <div className={val===1?"toggle-button-active":"toggle-button-unactive"}></div>
        </div>
    )
}
export default ToggleBar