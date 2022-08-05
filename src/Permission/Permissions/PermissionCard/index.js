import './PermissionCard.scss'
import ToggleBar from './toggle'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCookie } from '../../../cookie';
import { changeGroup, setGroupPermission, setGroupPermissionEach } from '../../../reducer/permission_reducer';

const PermissionCard=({idx,id,name})=>
{
    const dispatch=useDispatch()
    const [over,setOver]=useState(0)
    const per=useSelector(state=>state.permission_reducer.permission)
    const isPermission=useSelector(state=>state.permission_reducer.isPermission)
    const permissionFrom=useSelector(state=>state.drag_reducer.permissionFrom)
    const ondragover=(e)=>
    {
        e.preventDefault() 
        setOver(1)
    }
    const ondragleave=()=>
    {
        setOver(0)
    }
    const ondrop=()=>
    {
        setOver(0)
        dispatch(changeGroup(permissionFrom,name,id))
        
    }

    const permission=['READ','WRITE','CREATE','DELETE','BAN','INVITE']
    return(
        <div 
        onDragOver={ondragover}
        onDragLeave={ondragleave}
        onDrop={ondrop}
        className={over?"PermissionCard-body-over":"PermissionCard-body"}>
            <div className="PermissionCard-padd"></div>

            <div style={{width:'20px'}}></div>
            <div className="PermissionCard-box">
                <div className="PermissionCard-desc"> GROUP</div>
                <div className="PermissionCard-groupName">{name}</div>
            </div>
            
            <div style={{width:'30px'}}></div>
            <div className="PermissionCard-padd2"></div>
            {permission.map((data,index)=>{return(
                <div className="PermissionCard-box" style={{transform:'translateX(30px)'}}>
                <div className="PermissionCard-desc">{data}</div>
                    {<ToggleBar id={id} idx={index}
            ></ToggleBar>}
                </div>
               
            )})}
            
      
        </div>
    )
}
export default PermissionCard