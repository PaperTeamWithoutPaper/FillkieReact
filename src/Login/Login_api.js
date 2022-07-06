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
        navigate("/main");
    }
    },[window.location.search])
    return(
        null
    )
}
export default Login_api