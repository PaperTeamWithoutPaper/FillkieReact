import axios from 'axios'
import {useEffect} from 'react'
import qs from 'querystring'
import { useNavigate } from "react-router-dom";
const Login_api=()=>
{
    let navigate = useNavigate();
    useEffect(() => {
    let q = qs.parse(window.location.search);
    if(q["?token"]!=undefined)
    {
        window.localStorage.setItem("token", q["?token"]);
        fetch('https://api.fillkie.com/user/test', {
        method: "GET",
        headers: {
            'Authorization': `${localStorage.getItem('token')}`,
        }
      }).then((response)=>{
        //response.json().then((d)=>console.log(d))
        navigate("/main");
        }
      ) 
    }
    },[])
    return(
        null
    )
}
export default Login_api