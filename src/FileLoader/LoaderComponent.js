import Appbar from "../Appbar/Appbar"
import DirectoryPath from "./Directory/DirectoryPath"
import Drive from "./Drive/Drive"
import './LoaderComponent.scss'
import { useSelector, useDispatch } from "react-redux"
import CreateFileModal from "../Modal/FileModal/CreateFileModal"
import { useParams } from "react-router"
import { getCookie } from "../cookie"
import { useEffect } from "react"
import { setDirInfo,setFileInfo,fileLoading } from "../reducer/file_reducer"
const LoaderComponent=()=>
{
    const pathWidth=useSelector((state)=>state.file_reducer.width)
    const iscreate=useSelector(state=>state.file_reducer.iscreate)
    const type=useSelector(state=>state.file_reducer.typ)
    const {id,pid} = useParams()
    const dispatch=useDispatch()
    const readFile=()=>
    {
        dispatch(fileLoading(1))
        fetch(`https://api.fillkie.com/dir?projectId=${id}&folderId=${pid}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${getCookie('access')}`,
            },
            }).then((response)=>
            {
                response.json().then((d)=>{
                    dispatch(setFileInfo(d.data))
                    dispatch(fileLoading(0))
                })})

    }
    useEffect(readFile,[])








    return(
        <div>
            {iscreate?<CreateFileModal type={type}></CreateFileModal>:null}
            <Appbar type={1}></Appbar>
            <div style={{gridTemplateColumns: `${pathWidth+50}px 1fr`}} className="LoaderComponent-box">
                <DirectoryPath></DirectoryPath>
                <Drive></Drive>
            </div>
        </div>
    )
}
export default LoaderComponent