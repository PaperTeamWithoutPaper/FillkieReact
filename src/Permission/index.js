import Appbar from "../Appbar/Appbar"
import MembersComponent from './Members'
import './PermissionComponent.scss'
import PermissionChangeComponent from "./Permissions"
import { useSelector,useDispatch } from "react-redux"
import team_reducer from "../reducer/team_reducer"
import { getCookie } from "../cookie"
import { useEffect } from "react"
import { springAxios } from "../apis/api"
import { setGroupList,setGroupUsers,initGroupUsers,initPermission,setGroupPermission, isPermission} from "../reducer/permission_reducer"
import { useParams } from "react-router"
import { setUserInfo } from "../reducer/user_reducer"
const PermissionComponent=()=>
{
    const {teamId}=useParams()
    const dispatch=useDispatch()
    const getGroupUser=(groupId)=>
    {
        springAxios.get(`/permission/users/${groupId}/${teamId}`).then((response)=>dispatch(setGroupUsers(response.data.data)))
    }
    const getPermissionList=(groupId)=>
    {
        springAxios.get(`/permission/${groupId}/${teamId}`).then((response)=>dispatch(setGroupPermission(groupId,response.data.data.permission)))
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
            dispatch(isPermission(0))
        })
    }
    useEffect(()=>{
        getGroupList()
        springAxios.get('/user/profile').then((response)=>{dispatch(setUserInfo(response.data.data.userName,response.data.data.userImage))})},[])
    return(
        <div>
            <Appbar type={2}></Appbar>
            <div className="PermissionComponent-grid">
                <MembersComponent></MembersComponent>
                <PermissionChangeComponent></PermissionChangeComponent>
            </div>
        </div>
    )
}
export default PermissionComponent