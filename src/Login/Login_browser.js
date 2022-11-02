
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
        // api의 callback 주소로 code를 받을 시 돌아옴
        const redirect_uri = 'https://api.fillkie.com/spring/user/oauth/google';
        const response_type = "code";
        const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive ';
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
        <Appbar desc=
        {<p>1.Hello, fillkie is a service designed to make it easy to co-edit and manage notes on the web.<br></br><br></br>
            2.Please sign in using your Google ID in the window.
            </p>}
             type={0}></Appbar>
        <img className="Login-logo" src={require("./Icon/logo.png")}></img>
        <div className="Login-google-button" onClick={onLogin}>
                <img className="Login-button-logo" src={require('./Icon/googleLogo.png')}></img>
                <div className="Login-button-desc">Sign in with google</div>
            </div>
    </div>
    )
}
export default Login_browser
