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
    const teamIdx=useSelector(state=>state.team_reducer.currentTeam)
    const teams=useSelector(state=>state.team_reducer.teams)
    const getToggleList=()=>
    {
        
        fetch(`https://api.fillkie.com/permission/${id}/${teams[teamIdx]['teamId']}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        }).then((response)=>
        {
            response.json().then((d)=>{
                dispatch(setGroupPermission(id,d.data.permission))
   
        })})
    }

    const [toggle,setToggle]=useState(0)
    useEffect(()=>{Object.keys(per).includes(id)?setToggle(1):setToggle(0)},[per])
    useEffect(()=>{getToggleList();setToggle(0)},[])
    const permission=['READ','WRITE','CREATE','DELETE','BAN','INVITE']
    return(
        <div 
        draggable
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
                    {toggle?<ToggleBar id={id} idx={index}
            toggle={per[id][index]}></ToggleBar>:null}
                </div>
               
            )})}
            
      
        </div>
    )
}
export default PermissionCard