import CreateButton from "./CreateButton"
import "./Project.scss"
const ProjectComponent=()=>
{
    return(
        <div className="ProjectComponent">
            <div className="ProjectComponent-desc">Your Project</div>
            <CreateButton></CreateButton>
        </div>
    )
}
export default ProjectComponent