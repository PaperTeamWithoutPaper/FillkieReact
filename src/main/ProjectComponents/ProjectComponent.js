import Card from "./Card"
import DirectoryPath from "./DirectoryPath"
import "./Project.scss"
import {useSelector, useDispatch} from 'react-redux'
import project_reducer from '../../reducer/project_reducer'
const ProjectComponent=()=>
{
    //0:폴더 1:파일 2:프로젝트
    const project_data=useSelector(
        state=> state.project_reducer.projects
    )
    
    return(
        <div className="ProjectComponent">
            {/*<DirectoryPath></DirectoryPath>*/}
            <div className="ProjectComponent-desc">Your Project</div>
            <div className="ProjectComponent-flex">
                {project_data.map((data)=>{return(<Card type={data.type} thumbnail={data.thumbnail} title={data.title} desc={data.desc}></Card>)})}
            </div>
        </div>
    )
}
export default ProjectComponent