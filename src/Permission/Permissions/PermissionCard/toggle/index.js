import './toggle.scss'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setGroupPermissionEach } from '../../../../reducer/permission_reducer'
const ToggleBar=({id,idx,toggle})=>
{
    const [val,setVal]=useState()
    const dispatch=useDispatch()
    useEffect(()=>{if(toggle===true){setVal(1)}else{setVal(-1)}},[toggle])
    return (
        <div onClick={()=>{dispatch(setGroupPermissionEach(id,idx,toggle?false:true))}}
        className={val===1?"toggle-box-active":"toggle-box-unactive"}>
            <div className={val===1?"toggle-button-active":"toggle-button-unactive"}></div>
        </div>
    )
}
export default ToggleBar