import './InviteUserModal.scss';
import {useState, useEffect, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import { IsInviteTeam } from '../reducer/team_reducer';
import axios from 'axios'
const InviteUserModal=(props)=>
{
    const [loading,setLoading]=useState(0)
    const createRandomURL=()=>
    {
        return(`https://fillkie.com/welcome/${Math.random().toString(36).substr(2,30)}`)
    }
    const copyText=()=>
    {
        navigator.clipboard.writeText(randomurl)
    }
    const removeComponent=()=>
    {
        dispatch(IsInviteTeam(0))
    }
    const dispatch=useDispatch()
    useEffect(()=>{
        setLoading(1)
    },[])
    const randomurl = useMemo(() => createRandomURL(), []);
    return(
        <div className="InviteUserModal-box">
            <div className={loading?"InviteUserModal-bg":"InviteUserModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"InviteUserModal-body":"InviteUserModal-body-loading"}>
                <div className="InviteUserModal-title">Invite members</div>
                <div className="InviteUserModal-desc">Share this URL to your team members</div>
                <div className="InviteUserModal-inputbox">
                    <input value={randomurl} className="InviteUserModal-urlinput"></input>
                    <button onClick={copyText} className="InviteUserModal-copybutton">Copy</button>
                </div>
            </div>
            

        </div>
    )
}
export default InviteUserModal