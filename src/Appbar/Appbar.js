import './Appbar.scss'
import useScroll from './useScroll'
import {useDispatch, useSelector} from 'react-redux';
import { IsInviteTeam, setInviteUrl } from '../reducer/team_reducer';
const Appbar=(props)=>
{
    const type=props.type
    const scrollY=useScroll()
    const teams=useSelector((state)=>state.team_reducer.teams)
    const teamIdx=useSelector((state)=>state.team_reducer.currentTeam)
    const dispatch=useDispatch()
    const getUrl=()=>
    {
        dispatch(IsInviteTeam(1))

        fetch(`https://api.fillkie.com/team/invite?teamId=${teams[teamIdx]['teamId']}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
    }
        ).then((response)=>{
            response.json().then((d)=>{
            dispatch(setInviteUrl(d.data.url))
            
        })
            })
    }
    const user_profile=useSelector(state=>state.user_reducer.user_profile)
    return(
        <div className={scrollY>10?"Appbar-normal":"Appbar-active"}>  
            <div className="Appbar-grid">
            <a href="/login" className="node" >
            <div className='Appbar-icon' style={{textDecoration:'none'}}>Fillkie</div>
                </a>
                {type==0?<div className='Appbar-login_require'>로그인 해주세요.</div>:
                    <img className='Appbar-user_profile' src={user_profile} alt="" aria-hidden="true" data-noaft="" data-atf="1" data-frt="0"/>}
                {type==1?<div className="InviteUser">
                <div onClick={getUrl} className={scrollY>10?"InviteUser-body-normal":"InviteUser-body-active"}>+ Invite member</div>
                </div>: null}            
            </div>
        </div>
    )
}
export default Appbar