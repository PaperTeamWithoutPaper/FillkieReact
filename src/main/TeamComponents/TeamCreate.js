import './Team.scss'
import {useSelector, useDispatch} from 'react-redux';
import CreateTeamModal from '../../Modal/CreateTeamModal';
import { IsCreateTeam, setCurrentTeam, } from '../../reducer/team_reducer';
import { useEffect } from 'react';
const TeamCreate=()=>
{
    const teams=useSelector(state=> state.team_reducer.teams)
    const cur=useSelector(state=>state.team_reducer.currentTeam)
    const dispatch= useDispatch();
    return(
        <div className="TeamCreate">
            {teams.map((team)=>{return(<div onClick={()=>{dispatch(setCurrentTeam(team.idx))}} className={team.idx==cur?"TeamCreate-icon-active":"TeamCreate-icon"}>{team.teamName.slice(0,2)}</div>)})}
            <div className="TeamCreate-icon" onClick={()=>{dispatch(IsCreateTeam(1))}}>+</div>    
        </div>
    )
}
export default TeamCreate