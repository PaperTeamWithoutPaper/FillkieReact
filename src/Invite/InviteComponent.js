import {useParams} from "react-router-dom"
import {useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import { getCookie } from "../cookie";
import './Invite.scss'
import Appbar from "../Appbar/Appbar";
import { springAxios } from "../apis/api";
const InviteComponent=()=>
{
    const [teamName,setTeamName]=useState("")
    const {id} = useParams()
    const navigate=useNavigate()
    const accept=()=>
    {   
        springAxios.post('/team/invite/accept',{url:id}).then(()=>navigate('/mains'))
    }
    
    useEffect(()=>
    {
        springAxios.get(`/team/invite/validation?url=${id}`).then((response)=>setTeamName(response.data.data.teamName)).catch(()=>navigate('/welcome/error'))
    },[])
    
    return(
        <div>
        <Appbar type={2}></Appbar>
        <div className="Invite-box">
            <div className="Invite-title">✉️ INVITE</div>
            <hr style={{color:'yellow'}}></hr>
            <div className="Invite-desc"> {teamName} team is inviting you . </div>
            <img src="https://source.unsplash.com/random" className="Invite-team-thumbnail"></img>
            <div className="Invite-accept-button" onClick={accept}>Accept Inviting</div>
        </div>
        </div>
    )
}
export default InviteComponent