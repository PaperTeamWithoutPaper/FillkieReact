import './Appbar.scss'
import useScroll from './useScroll'
import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { IsInviteTeam, setInviteUrl } from '../reducer/team_reducer';
import InfoModal from '../Modal/InfoModal';

const Appbar=(props)=>
{
    const type=props.type
    const scrollY=useScroll()
    const teamList=useSelector((state)=>state.team_reducer.teams)
    const teamIdx=useSelector((state)=>state.team_reducer.currentTeam)
    const dispatch=useDispatch()
    const [mouseXY,setMouseXY]=useState({x:0,y:0})
    const [modal,setModal]=useState(0)
  
    const user_profile=useSelector(state=>state.user_reducer.user_profile)
    return(
        <div>
        <div className="Appbar-info-modal" style={{visibility:`${modal?'visible':'hidden'}` ,zIndex:'100',position:'absolute',left:`${mouseXY.x-500}px`,top:`${mouseXY.y+5}px`}}>
        {props.desc}
        </div>
        <div className="Appbar-active">  
            
            <a href="/mains" className="node"><div className='Appbar-icon' style={{textDecoration:'none'}}>coBoard</div></a>
            
                  

            {type==0?<div className='Appbar-login_require'>로그인 해주세요.</div>:<img className='Appbar-user_profile' src={user_profile} alt="" aria-hidden="true" data-noaft="" data-atf="1" data-frt="0"/>}
             
            <div style={{width:'10px'}}></div> 
        </div>
        </div>
    )
}
export default Appbar