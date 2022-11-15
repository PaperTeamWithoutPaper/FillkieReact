import PermissionCard from "./PermissionCard"
import "./PermissionChangeComponent.scss"
import { useSelector } from "react-redux"
import PermissionCreate from "./PermissionCreate"
import SaveButton from './Save'
const PermissionChangeComponent=()=>
{
    const groups=useSelector(state=>state.permission_reducer.groups)
    return(
        <div className="PermissionChangeComponent-body">
            <div className="PermissionChangeComponent-title">그룹 권한</div>
            <div className="PermissionChangeComponent-cardBox">
                {groups.map((child,index)=>{return(<PermissionCard idx={index} id={child.groupId} name={child.name}></PermissionCard>)})}
                <PermissionCreate></PermissionCreate>
            </div>
            <SaveButton></SaveButton>
        </div>
    )
}
export default PermissionChangeComponent