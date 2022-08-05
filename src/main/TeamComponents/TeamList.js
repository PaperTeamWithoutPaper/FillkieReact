import { useEffect, useState } from 'react'
import Modal from './Modal'
import {useSelector, useDispatch} from 'react-redux'
import { IsInviteTeam ,setInviteUrl} from '../../reducer/team_reducer'

const TeamList=()=>
{
    const teamList=useSelector(state=>state.team_reducer.teams)
    const teamNum=useSelector(state=>state.team_reducer.teamNum)
    const teamidx=useSelector(state=>state.team_reducer.currentTeam)
    
    const dispatch=useDispatch()
    var curTeamName=""
    

    if(teamList.length!=0)
    {
        curTeamName=teamList[teamidx]['teamName']  
    }
    const [listopen,setListopen]=useState(-1)
    return(
        <div className="TeamList-bg">
            <div className="TeamList-body" onClick={()=>{setListopen(listopen*(-1))}}>
                <div className="TeamList-upperblock">
                    <div className="TeamList-name">{curTeamName}</div>
                    <img src={require('./icon/arrow.png')} className={listopen==-1?"TeamList-icon-lower":"TeamList-icon-upper"}></img>
                </div>
                <div className="TeamList-lowerblock">
                    <div className="TeamList-users">{teamNum}-users</div>
                </div>
            </div>
            <Modal listopen={listopen}></Modal>
            
        </div>
    )
}
export default TeamList