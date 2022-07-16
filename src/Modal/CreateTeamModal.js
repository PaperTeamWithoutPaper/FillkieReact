import './CreateTeamModal.scss';
import {useCallback,useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { setTeamInfo,IsCreateTeam,setCurrentTeam} from '../reducer/team_reducer';
import axios from 'axios'
import Alarm from './Alarm';
import { getCookie } from '../cookie';
const CreateTeamModal=(props)=>
{
    const teamList=useSelector(state=>state.team_reducer.teams)

    const [teamName,setTeamName]=useState("")
    const teamlength=useSelector(state=>state.team_reducer.teams).length
    const removeComponent=()=>
    {
        dispatch(IsCreateTeam(0))
    }
    const [loading, setLoading]=useState(0)
    useEffect(()=>{
        setLoading(1)
    },[])

    const createTeam=()=>
    {
        fetch('https://api.fillkie.com/team/create', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        body: JSON.stringify({teamName:teamName}),
    }
        ).then((response)=>{
            response.json().then((d)=>{
            setLoading(0)
        })
    })}
    const fetchTeamList=useCallback(()=>
    {
      fetch(`https://api.fillkie.com/team/list`, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${getCookie('access')}`,
      },
      }).then((response)=>{
          response.json().then((d)=>{   
          dispatch(setTeamInfo(d.data))
          })})},[loading])
    useEffect(fetchTeamList,[loading])
    


    const dispatch=useDispatch()
    return(
        <div className="CreateTeamModal-box">
            
            <div className={loading?"CreateTeamModal-bg":"CreateTeamModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"CreateTeamModal-body":"CreateTeamModal-body-loading"}>
                <div className="CreateTeamModal-title">Create Team</div>
                <div className="CreateTeamModal-desc">Set your team name</div>
                <input onChange={(e)=>{setTeamName(e.target.value)}} value={teamName} placeholder="Enter team name" className="CreateTeamModal-teaminput"></input>
                <div className="CreateTeamModal-buttonbox">
                    <div className="CreateTeamModal-accept" onClick={createTeam}>Continue</div>
                    <div className="CreateTeamModal-no" onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}>Cancel</div>
                </div>
            </div>
            

        </div>
    )
}
export default CreateTeamModal