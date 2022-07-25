import './CreateProjectModal.scss';
import {useCallback,useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IsCreateProject} from '../../reducer/project_reducer';
import { getCookie } from '../../cookie';
import { setProjectInfo } from '../../reducer/project_reducer';
const CreateProjectModal=()=>
{

    const removeComponent=()=>
    {
        dispatch(IsCreateProject(0))
    }
    const [loading, setLoading]=useState(0)
    useEffect(()=>{
        setLoading(1)
    },[])
    const [pName,setPName]=useState("")
    const teamList=useSelector(state=>state.team_reducer.teams)
    const teamID=useSelector(state=>state.team_reducer.currentTeam)
    const postProject=()=>
    {
        fetch(`http://13.124.191.230:8888/team/${teamList[teamID]["teamId"]}/project/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${getCookie('access')}`,
            },
            body:JSON.stringify({
                name: pName
            })
            }).then((response)=>
            {
                fetch(`http://13.124.191.230:8888/team/${teamList[teamID]["teamId"]}/project/`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${getCookie('access')}`,
                    },
                    }).then((response)=>
                    {
                        response.json().then((d)=>{
                        dispatch(setProjectInfo(d.data))
                        setLoading(0);setTimeout(()=>removeComponent(),300)
                        })})
            })
    }
    const dispatch=useDispatch()
    return(
        <div className="CreateProjectModal-box">
            
            <div className={loading?"CreateProjectModal-bg":"CreateProjectModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"CreateProjectModal-body":"CreateProjectModal-body-loading"}>
                <div className="CreateProjectModal-title">Create Project</div>
                <div className="CreateProjectModal-desc">Set your Project name</div>
                <input value={pName} onChange={(e)=>setPName(e.target.value)} placeholder='Project Name' className="CreateTeamModal-teaminput"></input>
                <div className="CreateProjectModal-buttonbox">
                    <div className="CreateProjectModal-accept" onClick={postProject}>Continue</div>
                    <div className="CreateProjectModal-no" onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}>Cancel</div>
                </div>
            </div>
            

        </div>
    )
}
export default CreateProjectModal