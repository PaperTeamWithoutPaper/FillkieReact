import MemberCard from './MemberCard'
import "./MemberComponent.scss"
import { useSelector } from 'react-redux'
import permission_reducer from '../../reducer/permission_reducer'
const MembersComponent=()=>
{   
    const users=useSelector(state=>state.permission_reducer.users)
    
        

    return(
        <div className="MemberComponent-body">
            <div className="MemberComponent-title">Team Members</div>
            <div className="MemberComponent-memberBox">
                {users.map((child)=>{return(<MemberCard id={child.id} name={child.name} profile={child.profile}></MemberCard>)})}
            </div>
        </div>
    )
}
export default MembersComponent