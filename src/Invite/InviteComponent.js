import {useParams} from "react-router-dom"
import {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { getCookie } from "../cookie";
const InviteComponent=()=>
{
    const {id} = useParams()
    const navigate=useNavigate()
    useEffect(()=>
    {
        console.log('hello')
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
    },[])
    return(
        <div>
        {id}
        </div>
    )
}
export default InviteComponent