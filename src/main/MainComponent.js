import axios from 'axios'
import Appbar from '../Appbar/Appbar'
import store from '../index';
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
import { getCookie } from '../cookie';
const MainComponent=()=>
{
    const responsiveTeam = useMediaQuery({ minWidth: 1200 })
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
    //User Profile fetch
    const fetchUser= useCallback(()=>
    {
      
      fetch(`https://api.fillkie.com/user/profile`, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${getCookie("access")}`,
      },
      }).then((response)=>{
          response.json().then((d)=>{   
            dispatch(setUserInfo(d.data.userName,d.data.userImage))
          })
      })}
    ,[user_email])
    //Team detail fetch
    const fetchTeamDetail=()=>
    {
      fetch(`https://api.fillkie.com/team/detail?teamId=${teamList[teamID]['teamId']}`, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${getCookie("access")}`,
      },
      }).then((response)=>{
          response.json().then((d)=>{   
          dispatch(setTeamNum(d.data.headcount))
          })
      })}
    
    //Team List fetch
    const fetchTeamList= useCallback(()=>
    {
      fetch(`https://api.fillkie.com/team/list`, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${getCookie("access")}`,
      },
      }).then((response)=>{
          response.json().then((d)=>{   
          if(d.data!=null){
            dispatch(setTeamInfo(d.data))
            console.log(teamList)
            if(teamList.length!=0){
            fetchTeamDetail()
            }
          }
          
          })
      })}
    ,[teamID])
    

    useEffect(()=>
    {
      fetchUser()
    },[fetchUser])

    useEffect(()=>
    {
      fetchTeamList()
    },[fetchTeamList])

    return(
      <div>
        {alarm?<Alarm desc="복사되었습니다."></Alarm>:null}
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