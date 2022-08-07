import Card from "./Card"
import "./Project.scss"
import {useSelector, useDispatch} from 'react-redux'
import project_reducer from '../../reducer/project_reducer'
import { IsCreateProject } from "../../reducer/project_reducer"
const ProjectComponent=()=>
{
    //0:폴더 1:파일 2:프로젝트 3:생성버튼
    const project_data=useSelector(
        state=> state.project_reducer.projects
    )
    const teamNum=useSelector(state=>state.team_reducer.teamNum)
    const dispatch=useDispatch()
    return(
        <div className="ProjectComponent" onContextMenu={()=>{console.log('파일 생성 메뉴')}}>
            <div className="ProjectComponent-desc">{teamNum==0?'First Create Your Team':'Your Project'}</div>
            <div className="ProjectComponent-flex">
                {teamNum!=0?project_data.map((data)=>{return(<Card pid={data.folderId} id={data.id} type={4} title={data.name}></Card>)}):null}
                {teamNum!=0?<Card  type={3} thumbnail='' title='프로젝트 생성' desc='프로젝트 생성하기'></Card>:null}

            </div>
        </div>
    )
}
export default ProjectComponent