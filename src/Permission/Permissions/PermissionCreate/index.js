
import { useState,useRef } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { getCookie } from '../../../cookie'
import { springAxios } from '../../../apis/api'
import { setGroupList,setGroupUsers,initGroupUsers,initPermission,setGroupPermission} from "../../../reducer/permission_reducer"
import { useParams } from 'react-router'
const PermissionCreate=({name})=>
{
    const [groupName, setGroupName]=useState('')
    const {teamId}=useParams()
    const dispatch=useDispatch();
    const scrollRef=useRef()
    const getPermissionList=(groupId)=>
    {
        springAxios.get(`/permission/${groupId}/${teamId}`).then((response)=>dispatch(setGroupPermission(groupId,response.data.data.permission)))
    }
    const getGroupUser=(groupId)=>
    {
        springAxios.get(`/permission/users/${groupId}/${teamId}`).then((response)=>dispatch(setGroupUsers(response.data.data)))
    }
    const getGroupList=()=>
    {
        dispatch(initGroupUsers([]))
        springAxios.get(`/permission/groups/${teamId}`).then((response)=>{
            dispatch(setGroupList(response.data.data))
            for(var i=0;i<response.data.data.length;i++)
                {
                    getGroupUser(response.data.data[i]['groupId'])
                    getPermissionList(response.data.data[i]['groupId'])
                }
        })
    }
    const createGroup=()=>
    {
        springAxios.post(`/permission/group/create/${teamId}`,{groupName:groupName}).then(()=>{
            getGroupList();
            setGroupName('');
            setTimeout(()=>{scrollRef.current?.scrollIntoView({ behavior: 'smooth' })},100)})
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
              
                    <div onClick={createGroup} className="PermissionChangeComponent-createBox-box">
                        <img src={require('../../Icon/create.png')} className="PermissionChangeComponent-createBox-icon"></img>
                        <div ref={scrollRef} className="PermissionChangeComponent-createBox-desc">Create New Group</div>
                    </div>
            </div>
    )
}
export default PermissionCreate