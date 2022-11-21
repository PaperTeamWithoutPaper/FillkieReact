import axios from 'axios'
import {useEffect} from 'react'
import qs from 'querystring'
import { useNavigate } from "react-router-dom";
import { setCookie } from '../cookie'
const Login_api=()=>
{
    let navigate = useNavigate();
    useEffect(() => {
      let q = qs.parse(window.location.search);
      if(q["?access"]!=undefined)
      {
          setCookie('access',q["?access"],
          {
            path: "/",
            secure: true,
            sameSite: "none"
          })
          setCookie('refresh',q["?refresh"],
          {
            path: "/",
            secure: true,
            sameSite: "none"
          })
      }
      navigate('/mains')
      window.location.reload();
    },[])
    return(
        null
    )
}
export default Login_api