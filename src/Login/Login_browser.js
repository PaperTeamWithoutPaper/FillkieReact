
import axios from "axios";
import qs from "querystring";
import { useEffect } from "react";
import Appbar from "../Appbar/Appbar";
import cid from '../config';
import './Login.scss'
const Login_browser=()=>
{
    const onLogin=()=>{
        
        const OATUH_HOST = 'https://accounts.google.com/o/oauth2/auth';
        const client_id = cid;
        console.log(client_id)
        // api의 callback 주소로 code를 받을 시 돌아옴
        const redirect_uri = 'https://api.fillkie.com/user/oauth/google';
        const response_type = "code";
        const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email ';
        const access_type= "offline";
        const prompt= "consent";
        const AUTHORIZE_URI = `${OATUH_HOST}?${qs.stringify({
            client_id,
            redirect_uri,
            response_type,
            scope,
            access_type,
            prompt,
        })}`;
        window.location.href = AUTHORIZE_URI;
        
    }
    


    return (
    <div>
        <Appbar type={0}></Appbar>
        <div className="Login-box">
            <div className="Login-title">Sign in</div>
            <div className="Login-button" onClick={onLogin}>
                <img className="Login-button-logo" src={require('./Icon/googleLogo.png')}></img>
                <div className="Login-button-desc">Sign in with google</div>
            </div>
        </div>
    </div>
    )
}
export default Login_browser
