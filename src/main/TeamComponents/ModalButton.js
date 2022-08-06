import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { IsInviteTeam, setInviteUrl } from '../../reducer/team_reducer';

import { Link } from 'react-router-dom';
import { springAxios } from '../../apis/api';
const ModalButton=(props)=>
{
    const [ishover,setIshover]=useState(0)
    const teamList=useSelector((state)=>state.team_reducer.teams)
    const teamIdx=useSelector((state)=>state.team_reducer.currentTeam)
    const dispatch=useDispatch()
    const getUrl= async ()=>
    {
        dispatch(IsInviteTeam(1))
        await springAxios.get(`/team/invite?teamId=${teamList[teamIdx]['teamId']}`).then((response)=>{dispatch(setInviteUrl(response.data.data.url))})
    }
    return (
        <div style={{width:'100%'}}>
        {props.type===0?
        <div 
            onClick={getUrl}
            onMouseOver={()=>{setIshover(1)}} 
            onMouseOut={()=>{setIshover(0)}}
            className={ishover?"Modal-menu-active":"Modal-menu-normal"}>
            {props.data}
        </div>:
        <div className={ishover?"Modal-menu-active":"Modal-menu-normal"}
            onMouseOver={()=>{setIshover(1)}} 
            onMouseOut={()=>{setIshover(0)}}>
        <Link 
            style={{width:'100%',height:'100px',display:'block',textDecoration:'none',transition:'all ease 0.2s',color:`${ishover?'orange':'gray'}`}}
            to={teamList[teamIdx]!=undefined?`/permission/${teamList[teamIdx]['teamId']}`:null}
            
            >
            {props.data}</Link>
        </div>
        }
        </div>
        
    )
}
export default ModalButton