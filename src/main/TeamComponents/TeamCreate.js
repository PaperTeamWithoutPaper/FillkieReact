import './Team.scss'
import {useSelector, useDispatch} from 'react-redux';
import CreateTeamModal from '../../Modal/CreateTeamModal';
import { IsCreateTeam, setCurrentTeam, } from '../../reducer/team_reducer';
const TeamCreate=()=>
{
    const team_data=useSelector(
        state=> state.team_reducer.teams
    )
    const dispatch= useDispatch();
    return(
        <div className="TeamCreate">
            {team_data.map((team)=>{return(<div onClick={()=>{dispatch(setCurrentTeam(team.idx))}} className="TeamCreate-icon">{team.teamName.slice(0,2)}</div>)})}
            <div  className="TeamCreate-icon" onClick={()=>{dispatch(IsCreateTeam(1))}}>+</div>
            
        </div>
    )
}
export default TeamCreate