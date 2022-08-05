
import Appbar from '../Appbar/Appbar'
import {useEffect, useCallback, useState} from 'react'
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


import ManageTeamModal from '../Modal/ManageTeamModal';
import CreateProjectModal from '../Modal/FileModal/CreateProjectModal';
import axios from 'axios';
import { getCookie } from '../cookie';
import { setProjectInfo } from '../reducer/project_reducer';
import { springAxios,nodeAxios } from '../apis/api';

///











const MainComponent=()=>
{
  //Responsive Var//
    const responsiveTeam = useMediaQuery({ minWidth: 400 })
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
    const projectC=useSelector(state=>state.project_reducer.iscreate)
    const dispatch = useDispatch();
    //API CALL//
    //User Profile fetch
    useEffect(()=>{
      if(teamList.length!=0){
        if(teamList[teamID]["teamId"]!="null")
        {
          nodeAxios.get(`/team/${teamList[teamID]["teamId"]}/project/`).then((response)=>{
  
                setProjectLoading(0)
                dispatch(setProjectInfo(response.data.data))
                })
        springAxios.get(`team/detail?teamId=${teamList[teamID]["teamId"]}`).then((response)=>{
        dispatch(setTeamNum(response.data.data.headcount))})}
    }},[teamList])
    useEffect(()=> {async function fetchData(){
      setProjectLoading(1)
      await springAxios.get('/user/profile').then((response)=>{dispatch(setUserInfo(response.data.data.userName,response.data.data.userImage))})
      await springAxios.get('/team/list').then((response)=>{dispatch(setTeamInfo(response.data.data))})}
      fetchData();
    },[teamID])
    //Loading//
    const [projectLoading, setProjectLoading]=useState(1)

    return(
      <div>
        {alarm?<Alarm desc="복사되었습니다."></Alarm>:null}
        {inviting?<InviteUserModal></InviteUserModal>:null}
        {creating?<CreateTeamModal></CreateTeamModal>:null}
        {projectC?<CreateProjectModal></CreateProjectModal>:null}
        {/*<ManageTeamModal></ManageTeamModal>*/}
        <div style={{overflow:'hidden', position:'absolute'}}>
          <Appbar type={1}></Appbar>
          <div className={responsiveTeam?"MainGrid-big":"MainGrid-small"}>
              <TeamCreate></TeamCreate>
              {responsiveTeam?<TeamComponent></TeamComponent>:null}
              
              {<div style={{transition: 'all ease 0.3s', opacity:`${100-projectLoading*50}%`}}><ProjectComponent ></ProjectComponent></div>}
          </div>      
        </div>
      </div>
    )
}
export default  MainComponent