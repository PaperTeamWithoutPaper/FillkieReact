import Appbar from "../Appbar/Appbar"
import DirectoryPath from "./Directory/DirectoryPath"
import Drive from "./Drive/Drive"
import './LoaderComponent.scss'
import { useSelector, useDispatch } from "react-redux"
import CreateFileModal from "../Modal/FileModal/CreateFileModal"
import { useParams } from "react-router"
import { getCookie } from "../cookie"
import { useEffect } from "react"
import { setDirInfo,setFileInfo,fileLoading, setRootInfo, setCurDir } from "../reducer/file_reducer"
import { nodeAxios,springAxios } from "../apis/api"
import { setUserInfo } from "../reducer/user_reducer"
const LoaderComponent=()=>
{
    const pathWidth=useSelector((state)=>state.file_reducer.width)
    const iscreate=useSelector(state=>state.file_reducer.iscreate)
    const type=useSelector(state=>state.file_reducer.typ)
    const {id,pid} = useParams()
    const dispatch=useDispatch()
    const readFile=()=>
    {
        springAxios.get('/user/profile').then((response)=>{dispatch(setUserInfo(response.data.data.userName,response.data.data.userImage))})
        dispatch(fileLoading(1))
        dispatch(setCurDir(pid))
        
        nodeAxios.get(`/dir?projectId=${id}&folderId=${pid}`).then((response)=>{
            console.log(response.data.data)
            dispatch(setFileInfo(pid,response.data.data));
            dispatch(fileLoading(0))})
    }
    useEffect(readFile,[])


    return(
        <div>
            {iscreate?<CreateFileModal type={type}></CreateFileModal>:null}
            <Appbar 
            desc={<p>
                1. Right-click on the white screen on the right to open a window where you can create a note or folder.<br></br><br></br>
2. Create a note and click it to go to the meeting page where you can edit it together.<br></br><br></br>
3. Drag and drop makes it easy to upload files within the drive.
            </p>}
            
            type={1}></Appbar>
            <div style={{gridTemplateColumns: `${pathWidth+50}px 1fr`}} className="LoaderComponent-box">
                <DirectoryPath></DirectoryPath>
                <Drive></Drive>
            </div>
        </div>
    )
}
export default LoaderComponent