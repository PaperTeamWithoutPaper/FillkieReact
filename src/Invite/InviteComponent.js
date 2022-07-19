import {useParams} from "react-router-dom"
import {useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import { getCookie } from "../cookie";
import './Invite.scss'
import Appbar from "../Appbar/Appbar";
const InviteComponent=()=>
{
    const [teamName,setTeamName]=useState("")
    const {id} = useParams()
    const navigate=useNavigate()
    const accept=()=>
    {
        fetch('https://api.fillkie.com/team/invite/accept', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        body: JSON.stringify({url:id}),
        }).then((response)=>
        {
            response.json().then((d)=>{

            navigate('/main')
        })})
    }
    
    useEffect(()=>
    {
        fetch(`https://api.fillkie.com/team/invite/validation?url=${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getCookie('access')}`,
        },
        }).then((response)=>
        {
            response.json().then((d)=>{
            console.log(d)
            setTeamName(d.data.teamName)
        }).catch((response)=>navigate('/welcome/error'))
    })
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