import './Appbar.scss'
import useScroll from './useScroll'
import {useDispatch} from 'react-redux';
import { IsInviteTeam } from '../reducer/team_reducer';
const Appbar=(props)=>
{
    const type=props.type
    const scrollY=useScroll()
    const dispatch=useDispatch()
    return(
        <div className={scrollY>10?"Appbar-normal":"Appbar-active"}>  
            <div className="Appbar-grid">
            <a href="/login" className="node" >
            <div className='Appbar-icon' style={{textDecoration:'none'}}>Fillkie</div>
                </a>
                {type==0?<div className='Appbar-login_require'>로그인 해주세요.</div>:
                    <img className='Appbar-user_profile' src="https://lh3.googleusercontent.com/ogw/ADea4I4-td4kF7KJVZ2JVvMR0mUOMJhKHaI4b768CjDAGA=s32-c-mo" srcset="https://lh3.googleusercontent.com/ogw/ADea4I4-td4kF7KJVZ2JVvMR0mUOMJhKHaI4b768CjDAGA=s32-c-mo 1x, https://lh3.googleusercontent.com/ogw/ADea4I4-td4kF7KJVZ2JVvMR0mUOMJhKHaI4b768CjDAGA=s64-c-mo 2x " alt="" aria-hidden="true" data-noaft="" data-atf="1" data-frt="0"/>}
                {type==1?<div className="InviteUser">
                <div onClick={()=>{dispatch(IsInviteTeam(1))}} className={scrollY>10?"InviteUser-body-normal":"InviteUser-body-active"}>+ Invite member</div>
                </div>: null}            
            </div>
        </div>
    )
}
export default Appbar