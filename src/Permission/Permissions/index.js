import PermissionCard from "./PermissionCard"
import "./PermissionChangeComponent.scss"
import { useSelector } from "react-redux"
import PermissionCreate from "./PermissionCreate"
const PermissionChangeComponent=()=>
{
    const groups=useSelector(state=>state.permission_reducer.groups)
    return(
        <div className="PermissionChangeComponent-body">
            <div className="PermissionChangeComponent-title">Group Permission</div>
            <div className="PermissionChangeComponent-cardBox">
                {groups.map((child)=>{return(<PermissionCard id={child.groupId} name={child.name}></PermissionCard>)})}
                <PermissionCreate></PermissionCreate>
            </div>
            
        </div>
    )
}
export default PermissionChangeComponent