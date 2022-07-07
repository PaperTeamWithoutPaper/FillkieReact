import axios from 'axios'
import Appbar from '../Appbar/Appbar'
import store from '../index';
import { useDispatch, useSelector } from 'react-redux'
import {setUserInfo} from "../reducer/user_reducer";
import TeamComponent from './TeamComponents/TeamComponent';
import TeamCreate from './TeamComponents/TeamCreate';
import ProjectComponent from './ProjectComponents/ProjectComponent';
import { useMediaQuery } from 'react-responsive'
const MainComponent=()=>
{
    const responsiveTeam = useMediaQuery({ minWidth: 1200 })
    console.log(responsiveTeam)
      const { user_email, user_profile } = useSelector(state => ({
        user_email: state.user_email,
        user_profile: state.user_profile
      }));
    const dispatch = useDispatch();
    return(
        <div style={{overflow:'hidden'}}>
             <Appbar type={1}></Appbar>
             <div className={responsiveTeam?"MainGrid-big":"MainGrid-small"}>
              <TeamCreate></TeamCreate>
              {responsiveTeam?<TeamComponent></TeamComponent>:null}
              <ProjectComponent></ProjectComponent>
             </div>
             
           
        </div>
    )
}
export default  MainComponent