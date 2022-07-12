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
        console.log('test')
        window.localStorage.setItem("token", q["?token"]);
        fetch('https://api.fillkie.com/user/test', {
        method: "GET",
        headers: {
            'access-control-allow-origin': '*',
            'Authorization': `${localStorage.getItem('token')}`,
        }
      }).then((response)=>{
          console.log(response)
          
          navigate("/main");
        }
      ) 
    }
    },[window.location.search])
    return(
        null
    )
}
export default Login_api