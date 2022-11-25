import {useParams} from "react-router-dom"
import {useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import { getCookie } from "../cookie";
import './Invite.scss'
import Appbar from "../Appbar/Appbar";
const InviteErrorComponent=()=>
{  
    const navigate=useNavigate()
    const goback=()=>
    {
        navigate('/mains')
    }
    return(
        <div>
        <Appbar type={2}></Appbar>
        <div className="Invite-box">
            <div className="Invite-title">ERROR</div>
            <hr></hr>
            <div className="Invite-desc"> Ask your team administrator.</div>
            <img src="https://source.unsplash.com/random" className="Invite-team-thumbnail"></img>
            <div className="Invite-accept-button" onClick={goback}>Go back main page</div>
        </div>
        </div>
    )
}
export default InviteErrorComponent