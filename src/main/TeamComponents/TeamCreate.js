import './Team.scss'
import {useSelector, useDispatch} from 'react-redux';
import CreateTeamModal from './CreateTeamModal';
import { IsCreateTeam } from '../../reducer/team_reducer';
const TeamCreate=()=>
{
    const team_data=useSelector(
        state=> state.team_reducer.teams
    )
    const dispatch= useDispatch();
    return(
        <div className="TeamCreate">
            
            {team_data.map((team)=>{return(<div className="TeamCreate-icon">{team.title}</div>)})}
            <div className="TeamCreate-icon" onClick={()=>{dispatch(IsCreateTeam(1))}}>+</div>
            
        </div>
    )
}
export default TeamCreate