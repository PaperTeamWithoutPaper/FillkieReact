import MemberCard from './MemberCard'
import "./MemberComponent.scss"
const MembersComponent=()=>
{   
    const test=[
        {
            id:1,
            name:'kim1',
            profile:'null',
        },
        {
            id:2,
            name:'kim2',
            profile:'null',
        },
        {
            id:3,
            name:'kim3',
            profile:'null',
        },
        {
            id:1,
            name:'kim1',
            profile:'null',
        },
        {
            id:2,
            name:'kim2',
            profile:'null',
        },
        {
            id:3,
            name:'kim3',
            profile:'null',
        },
        {
            id:1,
            name:'kim1',
            profile:'null',
        },
        {
            id:2,
            name:'kim2',
            profile:'null',
        },
        {
            id:3,
            name:'kim3',
            profile:'null',
        },
        {
            id:1,
            name:'kim1',
            profile:'null',
        },
        {
            id:2,
            name:'kim2',
            profile:'null',
        },
        {
            id:3,
            name:'kim3',
            profile:'null',
        },
]
    return(
        <div className="MemberComponent-body">
            <div className="MemberComponent-title">Team Members</div>
            <div className="MemberComponent-memberBox">
                {test.map((child)=>{return(<MemberCard id={child.id} name={child.name} profile={child.profile}></MemberCard>)})}
            </div>
        </div>
    )
}
export default MembersComponent