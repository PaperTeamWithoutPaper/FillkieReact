import './CreateTeamModal.scss';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { IsCreateTeam } from '../reducer/team_reducer';
import axios from 'axios'
const CreateTeamModal=(props)=>
{
    const [teamName,setTeamName]=useState("")
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
        axios.post("https://api.fillkie.com/team/create",{teamName:teamName},{
            'Authorization': `${localStorage.getItem('token')}`,
        }
        ).then((response)=>{console.log(response)})
    }
    const dispatch=useDispatch()
    return(
        <div className="CreateTeamModal-box">
            <div className={loading?"CreateTeamModal-bg":"CreateTeamModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"CreateTeamModal-body":"CreateTeamModal-body-loading"} onClick={()=>{console.log('a')}}>
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