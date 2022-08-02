import './PermissionCard.scss'
import ToggleBar from './toggle'
import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCookie } from '../../../cookie';
const PermissionCard=({id,name})=>
{
    
    const [over,setOver]=useState(0)
    const [per,setPer]=useState({0:true,1:true,2:true,3:true,4:true,5:true})
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
        console.log(permissionFrom)
        setOver(0)
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
                setPer(d.data.permission)
      
        })})
    }
    useEffect(()=>{getToggleList()},[])
    useEffect(()=>{console.log(per)},[per])
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
                    <ToggleBar toggle={per[index]}></ToggleBar>
                </div>
               
            )})}
            
      
        </div>
    )
}
export default PermissionCard