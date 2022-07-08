
import axios from "axios";
import qs from "querystring";
import { useEffect } from "react";
import Appbar from "../Appbar/Appbar";
import cid from '../config';
const Login_browser=()=>
{
    const onLogin=()=>{
        
        const OATUH_HOST = 'https://accounts.google.com/o/oauth2/auth';
        const client_id = cid;
        console.log(client_id)
        // api의 callback 주소로 code를 받을 시 돌아옴
        const redirect_uri = 'https://api.fillkie.com/user/oauth/google/callback';
        
        const response_type = "code";
        const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email ';

        const AUTHORIZE_URI = `${OATUH_HOST}?${qs.stringify({
            client_id,
            redirect_uri,
            response_type,
            scope
        })}`;
        window.location.href = AUTHORIZE_URI;
        
    }
    


    return (
    <div>
        <Appbar type={0}></Appbar>
        <div style={{fontSize:"60px"}}>test</div>
    <div style={styles.loginButton}onClick={onLogin}>
        <div style={styles.loginButtonText}>Google Login</div></div>
    </div>
    )
}
export default Login_browser

const styles=
{
    loginButton:{
        borderRadius:'100px',
        textAlign:'center',
        width:'150px',
        height:'50px',
        backgroundColor:'orange'
    },
    loginButtonText:
    {
        color:'white',
        transform:'translateY(60%)'
    }
}