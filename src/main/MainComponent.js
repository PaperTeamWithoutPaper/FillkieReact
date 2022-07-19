
import Appbar from '../Appbar/Appbar'
import {useEffect, useCallback} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {setUserInfo} from "../reducer/user_reducer";
import TeamComponent from './TeamComponents/TeamComponent';
import TeamCreate from './TeamComponents/TeamCreate';
import ProjectComponent from './ProjectComponents/ProjectComponent';
import { useMediaQuery } from 'react-responsive'
import CreateTeamModal from '../Modal/CreateTeamModal';
import { IsCreateTeam, setTeamInfo, setTeamNum } from '../reducer/team_reducer';
import InviteUserModal from '../Modal/InviteUserModal';
import Alarm from '../Modal/Alarm';
import { getUserInfo } from '../apis/api/userInfo';
import { getTeamList,getTeamDetail } from '../apis/api/team';
import ManageTeamModal from '../Modal/ManageTeamModal';
const MainComponent=()=>
{
  //Responsive Var//
    const responsiveTeam = useMediaQuery({ minWidth: 1200 })
  //Redux//
    const { user_email, user_profile } = useSelector(state => ({
      user_email: state.user_reducer.user_email,
      user_profile: state.user_reducer.user_profile
    }));
    const creating=useSelector(state=> state.team_reducer.creating)
    const inviting=useSelector(state=> state.team_reducer.inviting)
    const teamList=useSelector(state=>state.team_reducer.teams)
    const teamID=useSelector(state=>state.team_reducer.currentTeam)
    const alarm=useSelector(state=>state.modal_reducer.isCreate)
    const dispatch = useDispatch();
    //API CALL//
    //User Profile fetch
    useEffect(()=>{
      if(teamList.length!=0){
        if(teamList[teamID]["teamId"]!="null")
        {
      getTeamDetail(teamList[teamID]["teamId"]).then((response)=>{dispatch(setTeamNum(response.data.headcount))})}
    }},[teamList])
    useEffect(()=> {async function fetchData(){
      await getUserInfo().then((response)=>{dispatch(setUserInfo(response.data.userName,response.data.userImage))})
      await getTeamList().then((response)=>{dispatch(setTeamInfo(response.data))})}
      fetchData();
    },[teamID])

    return(
      <div>
        {alarm?<Alarm desc="복사되었습니다."></Alarm>:null}
        {inviting?<InviteUserModal></InviteUserModal>:null}
        {creating?<CreateTeamModal></CreateTeamModal>:null}
        {/*<ManageTeamModal></ManageTeamModal>*/}
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