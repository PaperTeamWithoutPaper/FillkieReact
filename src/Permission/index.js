import Appbar from "../Appbar/Appbar"
import MembersComponent from './Members'
import './PermissionComponent.scss'
import PermissionChangeComponent from "./Permissions"
import { useSelector,useDispatch } from "react-redux"
import team_reducer from "../reducer/team_reducer"
import { getCookie } from "../cookie"
import { useEffect } from "react"
import { springAxios } from "../apis/api"
import { setGroupList,setGroupUsers,initGroupUsers,initPermission} from "../reducer/permission_reducer"
const PermissionComponent=()=>
{
    const teamIdx=useSelector(state=>state.team_reducer.currentTeam)
    const teams=useSelector(state=>state.team_reducer.teams)
    const dispatch=useDispatch()
    const getGroupUser=(groupId)=>
    {
        springAxios.get(`/permission/users/${groupId}/${teams[teamIdx]['teamId']}`).then((response)=>dispatch(setGroupUsers(response.data.data)))
    }
    const getGroupList=()=>
    {
        dispatch(initGroupUsers([]))
        springAxios.get(`/permission/groups/${teams[teamIdx]['teamId']}`).then((response)=>{
            dispatch(setGroupList(response.data.data))
            for(var i=0;i<response.data.data.length;i++)
                {
                    getGroupUser(response.data.data[i]['groupId'])
                }
        })
    }
    useEffect(()=>{getGroupList()},[])
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