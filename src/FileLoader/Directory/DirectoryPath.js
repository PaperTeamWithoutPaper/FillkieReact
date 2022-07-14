import './DirectoryPath.scss'
import {useSelector} from 'react-redux'
import DirectoryBar from './DirectoryBar'
const DirectoryPath=()=>
{
    const files=useSelector((state)=>state.file_reducer.files)
    return(
        <div className="DirectoryPath-body">
            <div className="DirectoryPath-title">PROJECT1</div>
            {files.map((e)=>{return(<DirectoryBar title={e.title}></DirectoryBar>)})}
        </div>
    )
}
export default DirectoryPath