
import { useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { getCookie } from '../../../cookie'
const PermissionCreate=({name})=>
{
    const [groupName, setGroupName]=useState('')
    const teamIdx=useSelector(state=>state.team_reducer.currentTeam)
    const teams=useSelector(state=>state.team_reducer.teams)
    const createGroup=()=>
    {
        fetch(`https://api.fillkie.com/permission/group/create/${teams[teamIdx]['teamId']}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        body:{
            "groupName" : groupName
        }
        }).then((response)=>
        {
            response.json().then((d)=>{
                console.log(d.data)
        })})
    }
    return(
        <div className="PermissionChangeComponent-createBox">
                    <div className="PermissionCard-padd"></div>
                    <div style={{width:'20px'}}></div>
                    <div className="PermissionCard-box">
                        <div className="PermissionCard-desc"> GROUP</div>
                        <input onChange={(e)=>{setGroupName(e.target.value)}} value={groupName} placeholder="Set Name" className="PermissionCard-groupNameInput"></input>
                    </div>
                    <div style={{width:'30px'}}></div>
                    <div className="PermissionCard-padd2"></div>
              
                    <div className="PermissionChangeComponent-createBox-box">
                        <img src={require('../../Icon/create.png')} className="PermissionChangeComponent-createBox-icon"></img>
                        <div onClick={createGroup}  className="PermissionChangeComponent-createBox-desc">Create New Group</div>
                    </div>
            </div>
    )
}
export default PermissionCreate