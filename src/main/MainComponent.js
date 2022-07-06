import axios from 'axios'
import Appbar from '../Appbar/Appbar'
import store from '../index';
import { useDispatch, useSelector } from 'react-redux'
import {setUserInfo} from "../reducer/user_reducer";
import TeamComponent from './TeamComponents/TeamComponent';
import TeamCreate from './TeamComponents/TeamCreate';
import ProjectComponent from './ProjectComponents/ProjectComponent';

const MainComponent=()=>
{
    /*fetch('https://c4d1-221-148-248-129.jp.ngrok.io/user/test', {
        method: "GET",
        headers: {
            'Authorization': `${localStorage.getItem('token')}`,
        }
      }).then((response)=>console.log(response)) */
      const { user_email, user_profile } = useSelector(state => ({
        user_email: state.user_email,
        user_profile: state.user_profile
      }));
    const dispatch = useDispatch();
    return(
        <div style={{overflow:'hidden'}}>
             <Appbar type={1}></Appbar>
             <div className="MainGrid">
              <TeamCreate></TeamCreate>
              <TeamComponent></TeamComponent>
              <ProjectComponent></ProjectComponent>
             </div>
             
           
        </div>
    )
}
export default  MainComponent