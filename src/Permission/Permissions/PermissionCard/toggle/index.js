import './toggle.scss'
import { useEffect, useState } from 'react'
const ToggleBar=({toggle})=>
{

    const [val,setVal]=useState(toggle)
    useEffect(()=>{if(toggle===true){setVal(1)}else{setVal(-1)}},[toggle])
    return (
        <div onClick={()=>{setVal(val*(-1))}} className={val===1?"toggle-box-active":"toggle-box-unactive"}>
            <div className={val===1?"toggle-button-active":"toggle-button-unactive"}></div>
        </div>
    )
}
export default ToggleBar