import Card from "./Card"
import DirectoryPath from "./DirectoryPath"
import "./Project.scss"
const ProjectComponent=()=>
{
    return(
        <div className="ProjectComponent" style={{position:'relative', /*display:'grid',gridTemplateColumns: '170px 1fr'*/}}>
            {/*<DirectoryPath></DirectoryPath>*/}
            <div>
                <div className="ProjectComponent-desc">Your Project</div>
                <Card type={1} thumbnail="" title="File" desc="Note1"></Card>
                <Card type={0} thumbnail="" title="Directory" desc="폴더"></Card>
            </div>
        </div>
    )
}
export default ProjectComponent