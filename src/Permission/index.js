import Appbar from "../Appbar/Appbar"
import MembersComponent from './Members'
import './PermissionComponent.scss'
import PermissionChangeComponent from "./Permissions"
import { useSelector,useDispatch } from "react-redux"
import team_reducer from "../reducer/team_reducer"
import { getCookie } from "../cookie"
import { useEffect } from "react"
import { setGroupList,setGroupUsers,initGroupUsers} from "../reducer/permission_reducer"
const PermissionComponent=()=>
{
    const teamIdx=useSelector(state=>state.team_reducer.currentTeam)
    const teams=useSelector(state=>state.team_reducer.teams)
    const dispatch=useDispatch()
    const getGroupUser=(groupId,groupName)=>
    {
        fetch(`https://api.fillkie.com/permission/users/${groupId}/${teams[teamIdx]['teamId']}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        }).then((response)=>
        {
            response.json().then((d)=>{
                //d.data.groupName=groupName
                console.log(d.data)
                dispatch(setGroupUsers(d.data))
        })})
    }
    const getGroupList=()=>
    {
        dispatch(initGroupUsers([]))
        fetch(`https://api.fillkie.com/permission/groups/${teams[teamIdx]['teamId']}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        }).then((response)=>
        {
            response.json().then((d)=>{
                dispatch(setGroupList(d.data))
                for(var i=0;i<d.data.length;i++)
                {
                    getGroupUser(d.data[i]['groupId'],d.data[i]['name'])
                }

        })})
    
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