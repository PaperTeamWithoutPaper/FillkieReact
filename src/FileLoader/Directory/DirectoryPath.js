import './DirectoryPath.scss'
import {useSelector} from 'react-redux'
const DirectoryPath=()=>
{
    const files=useSelector((state)=>state.file_reducer.files)
    return(
        <div className="DirectoryPath-body">
            <div className="DirectoryPath-title">PROJECT1</div>
            {files.map((e)=>{return(<div className="DirectoryPath-object">{e.title}</div>)})}
        </div>
    )
}
export default DirectoryPath