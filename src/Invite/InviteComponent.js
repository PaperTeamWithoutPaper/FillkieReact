import {useParams} from "react-router-dom"
import {useEffect} from 'react'
const InviteComponent=()=>
{
    const {id} = useParams()
    useEffect(()=>
    {
        console.log('hello')
        fetch('https://api.fillkie.com/team/invite/accept', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({url:id}),
    }
        ).then((response)=>{
            console.log(response)
            response.json().then((d)=>{
            console.log(d)
        })

            })
    },[])
    return(
        <div>
        {id}
        </div>
    )
}
export default InviteComponent