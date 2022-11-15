import './InviteUserModal.scss';
import {useState, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { IsInviteTeam } from '../reducer/team_reducer';
import axios from 'axios'
import { setModalDesc, isCreateAlarm } from '../reducer/modal_reducer';

const InviteUserModal=(props)=>
{
    const [loading,setLoading]=useState(0)
    const param=useSelector((state)=>state.team_reducer.inviteUrl)
    const url=`https://fillkie.com/welcome/${param}`
    const copyText=()=>
    {
        dispatch(setModalDesc("복사되었습니다."))
        dispatch(isCreateAlarm(1))
        navigator.clipboard.writeText(url)
    }
    const removeComponent=()=>
    {
        dispatch(IsInviteTeam(0))
        setLoading(0)
    }
    const dispatch=useDispatch()
    useEffect(()=>{
        setLoading(1)
    },[])

    return(
        <div className="InviteUserModal-box">
            <div className={loading?"InviteUserModal-bg":"InviteUserModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"InviteUserModal-body":"InviteUserModal-body-loading"}>
                <div className="InviteUserModal-title">팀원 초대</div>
                <div className="InviteUserModal-desc">이 링크 주소를 팀원에게 공유하세요.</div>
                <div className="InviteUserModal-inputbox">
                    <input onChange={()=>{}} value={url} className="InviteUserModal-urlinput"></input>
                    <button onClick={copyText} className="InviteUserModal-copybutton">복사</button>
                </div>
            </div>
            

        </div>
    )
}
export default InviteUserModal