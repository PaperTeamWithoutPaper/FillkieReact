import './Upper.scss'
import Fade from 'react-reveal/Fade';
import qs from "querystring";
import { useNavigate } from "react-router-dom";
import cid from '../config';
import { setCookie } from '../cookie';
import {useState} from 'react'
const Upper=()=>
{
    const [isArrow,setIsArrow]=useState(1)
    const navigate=useNavigate();
    const jwt=['bearer%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2Mzc0ZTg0YWQwZDFlMDM5YThjNTAyYTgiLCJpYXQiOjE2NzAzMzU5ODYsImV4cCI6MTY3MDM2NDc4Nn0._zQzVwMFYI68GUqtYcoSpO5FD5yYzIDs87roOUX0SRg',
    'bearer%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzgwMDg3MTgzNDZhMjNlNGIzNzhkZGYiLCJpYXQiOjE2NzAzMzYwMTcsImV4cCI6MTY3MDM2NDgxN30.hr7RD1SzwxaetiTkK3NkgsrTQ2lRaqVnAJ42Qa7LhCg']
    const onGoogleLogin=()=>{
        
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
    const onTestLogin=(id)=>
    {
        navigate('/loginapi?access='+jwt[id])
        //window.location.reload();
    }
    return (
    <div className="Upper-box">
    <div className="Upper-container"
    onWheel={()=>{if(window.scrollY>10) {setIsArrow(0)}else{setIsArrow(1)}}}
    >
        
        <Fade bottom
        delay={0}>
            <div className="Upper-bg">
                <div className="Upper-title">
                    coBoard
                </div>
                <div className="Upper-subtitle">
                Collaborative Note For All
                </div>
                <img style={{filter:'brightness(0)', transform:'translate(-15px,-20px)'}} src={require('./lines.png')} width={300} height={30}></img>
                <div className="Upper-desc">
                Teams that desire concurrent communication, personal storage, various writing tools while non-face-to-face working, coBoard offers all desired features for its successful management.
                </div>
                <div className="Upper-buttonbox">
                    <div className="Upper-button" onClick={onGoogleLogin} >Sign In with Google</div>
                    <div className="Upper-button" onClick={()=>{onTestLogin(0)}}>Sign in with Test1</div>
                    <div className="Upper-button" onClick={()=>{onTestLogin(1)}}>Sign in with Test2</div>
                </div>
                
            </div>
            
            
        </Fade>
        <Fade bottom
        delay={200}>
            <div style={{width: '500px',margin: '0 auto'}}>
            <img className="Upper-img" src="https://opendoodles.s3-us-west-1.amazonaws.com/zombieing.png"></img>
            </div>
        </Fade>
   

  
    </div>
    </div>
    )
}
export default Upper