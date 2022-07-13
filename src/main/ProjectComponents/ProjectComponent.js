import Card from "./Card"
import "./Project.scss"
import {useSelector, useDispatch} from 'react-redux'
import project_reducer from '../../reducer/project_reducer'
const ProjectComponent=()=>
{
    //0:폴더 1:파일 2:프로젝트 3:생성버튼
    const project_data=useSelector(
        state=> state.project_reducer.projects
    )
    
    return(
        <div className="ProjectComponent" onContextMenu={()=>{console.log('파일 생성 메뉴')}}>
            <div className="ProjectComponent-desc">Your Project</div>
            <div className="ProjectComponent-flex">
                {project_data.map((data)=>{return(<Card type={data.type} thumbnail={data.thumbnail} title={data.title} desc={data.desc}></Card>)})}
                <Card type={3} thumbnail='' title='프로젝트 생성' desc='프로젝트 생성하기'></Card>
            </div>
        </div>
    )
}
export default ProjectComponent