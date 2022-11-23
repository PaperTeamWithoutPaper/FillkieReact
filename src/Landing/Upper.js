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
    const jwt=['bearer%20eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MmY0YjM4ZDcyNWRiNjZjYWFiNTVmYzUiLCJpYXQiOjE2NjkwMTk2NzcsImV4cCI6MTY2OTA0ODQ3N30.yrEvnKPKZ9cfhHhYt0apHrx8hTTbU_R-_1v03TkcbmM','asd','asd']
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
    const onTestLogin=()=>
    {
        navigate('/loginapi?access='+jwt[0])
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
                    Fillkie
                </div>
                <div className="Upper-subtitle">
                Collaborative Note For All
                </div>
                <img style={{filter:'brightness(0)', transform:'translate(-15px,-20px)'}} src={require('./lines.png')} width={300} height={30}></img>
                <div className="Upper-desc">
                Teams that desire concurrent communication, personal storage, various writing tools while non-face-to-face working, Fillkie offers all desired features for its successful management.
                </div>
                <div className="Upper-buttonbox">
                    <div className="Upper-button" onClick={onGoogleLogin} >Sign In with Google</div>
                    <div className="Upper-button" onClick={onTestLogin}>Sign in with Test</div>
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