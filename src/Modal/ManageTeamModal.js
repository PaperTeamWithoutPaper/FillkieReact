import './ManageTeamModal.scss';
import {useCallback,useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios'
import Alarm from './Alarm';
import { getCookie } from '../cookie';


const ManageTeamModal=(props)=>
{

    const removeComponent=()=>
    {
        //dispatch(IsManageTeam(0))
    }
    const [loading, setLoading]=useState(0)
    useEffect(()=>{
        setLoading(1)
    },[])


    


    const dispatch=useDispatch()
    return(
        <div className="ManageTeamModal-box">
            
            <div className={loading?"ManageTeamModal-bg":"ManageTeamModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"ManageTeamModal-body":"ManageTeamModal-body-loading"}>
                <div className="ManageTeamModal-title">Manage Team</div>
                <div className="ManageTeamModal-desc">dump team members</div>
              
                <div className="ManageTeamModal-buttonbox">
                    <div className="ManageTeamModal-accept">Continue</div>
                    <div className="ManageTeamModal-no" onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}>Cancel</div>
                </div>
            </div>
            

        </div>
    )
}
export default ManageTeamModal