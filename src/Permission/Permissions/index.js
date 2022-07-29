import PermissionCard from "./PermissionCard"
import "./PermissionChangeComponent.scss"
const PermissionChangeComponent=()=>
{
    const test=[
        {
            id:1,
            groupName:"testgroup"
        },
        {
            id:2,
            groupName:"testgroup"
        },
        {
            id:2,
            groupName:"testgroup"
        },
        {
            id:2,
            groupName:"testgroup"
        },
        {
            id:2,
            groupName:"testgroup"
        },
        {
            id:2,
            groupName:"testgroup"
        }
    ]
    return(
        <div className="PermissionChangeComponent-body">
            <div className="PermissionChangeComponent-title">Group Permission</div>
            <div className="PermissionChangeComponent-cardBox">
                {test.map(()=>{return(<PermissionCard></PermissionCard>)})}
            </div>
            <div className="PermissionChangeComponent-createBox">
                <img src={require('../Icon/create.png')} className="PermissionChangeComponent-createBox-icon"></img>
                <div className="PermissionChangeComponent-createBox-desc">Create New Group</div>
            </div>
        </div>
    )
}
export default PermissionChangeComponent