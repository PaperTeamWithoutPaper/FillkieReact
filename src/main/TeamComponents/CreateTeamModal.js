import './CreateTeamModal.scss';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import { IsCreateTeam } from '../../reducer/team_reducer';
const CreateTeamModal=(props)=>
{
    const dispatch=useDispatch()
    return(
        <div className="CreateTeamModal-bg" onClick={()=>{dispatch(IsCreateTeam(0)); console.log('a')}}>
            <div className= "CreateTeamModal-body">
                <div className="CreateTeamModal-title">팀 생성하기</div>
                <div className="CreateTeamModal-title">팀 이름을 정해주세요.</div>
                <input></input>
                <div>확인</div>
                <div>취소</div>
            </div>

        </div>
    )
}
export default CreateTeamModal