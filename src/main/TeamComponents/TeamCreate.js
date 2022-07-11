import './Team.scss'
import {useSelector} from 'react-redux';
const TeamCreate=()=>
{
    const team_data=useSelector(
        state=> state.team_reducer.teams
    )
    return(
        <div className="TeamCreate">
            {team_data.map((team)=>{return(<div className="TeamCreate-icon">{team.title}</div>)})}
            <div className="TeamCreate-icon">+</div>
        </div>
    )
}
export default TeamCreate