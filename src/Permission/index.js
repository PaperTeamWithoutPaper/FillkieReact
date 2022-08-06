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
            <Appbar desc={ <p>
                1. On the left side, you can view information about the members of the team and on the right side, you can view the groups created for the team.<br></br><br></br>
2. If you have permission to modify permissions, you can set permissions for each group.<br></br><br></br>
3. You can create any group of users from the right side.<br></br><br></br>
4. Drag and drop a member to a specific group from the left side to the right side to easily change the group to which the member belongs.<br></br><br></br>
5. To save the changes, press the save button on the bottom right.
            </p>} type={2}></Appbar>
            <div className="PermissionComponent-grid">
                <MembersComponent></MembersComponent>
                <PermissionChangeComponent></PermissionChangeComponent>
            </div>
        </div>
    )
}
export default PermissionComponent