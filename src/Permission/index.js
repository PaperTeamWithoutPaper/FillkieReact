import Appbar from "../Appbar/Appbar"
import MembersComponent from './Members'
import './PermissionComponent.scss'
import PermissionChangeComponent from "./Permissions"
const PermissionComponent=()=>
{
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