import axios from 'axios'
import Appbar from '../Appbar/Appbar'
import store from '../index';
import { useDispatch, useSelector } from 'react-redux'
import {setUserInfo} from "../reducer/user_reducer";
import TeamComponent from './TeamComponents/TeamComponent';
import TeamCreate from './TeamComponents/TeamCreate';
import ProjectComponent from './ProjectComponents/ProjectComponent';
import { useMediaQuery } from 'react-responsive'
import CreateTeamModal from '../Modal/CreateTeamModal';
import { IsCreateTeam } from '../reducer/team_reducer';
import InviteUserModal from '../Modal/InviteUserModal';
import Alarm from '../Modal/Alarm';
const MainComponent=()=>
{
    const responsiveTeam = useMediaQuery({ minWidth: 1200 })
    const { user_email, user_profile } = useSelector(state => ({
      user_email: state.user_reducer.user_email,
      user_profile: state.user_reducer.user_profile
    }));
    const creating=useSelector(state=> state.team_reducer.creating)
    const inviting=useSelector(state=> state.team_reducer.inviting)
    const dispatch = useDispatch();
    return(
      <div>
        <Alarm desc="복사되었습니다."></Alarm>
        {inviting?<InviteUserModal></InviteUserModal>:null}
        {creating?<CreateTeamModal></CreateTeamModal>:null}
        <div style={{overflow:'hidden', position:'absolute'}}>
          <Appbar type={1}></Appbar>
          <div className={responsiveTeam?"MainGrid-big":"MainGrid-small"}>
              <TeamCreate></TeamCreate>
              {responsiveTeam?<TeamComponent></TeamComponent>:null}
              <ProjectComponent></ProjectComponent>
          </div>      
        </div>
      </div>
    )
}
export default  MainComponent