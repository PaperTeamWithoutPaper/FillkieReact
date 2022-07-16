import Appbar from "../Appbar/Appbar"
import DirectoryPath from "./Directory/DirectoryPath"
import Drive from "./Drive/Drive"
import './LoaderComponent.scss'
import { useSelector } from "react-redux"
const LoaderComponent=()=>
{
    const pathWidth=useSelector((state)=>state.file_reducer.width)
    return(
        <div>
            <Appbar type={1}></Appbar>
            <div style={{gridTemplateColumns: `${pathWidth+50}px 1fr`}} className="LoaderComponent-box">
                <DirectoryPath></DirectoryPath>
                <Drive></Drive>
            </div>
        </div>
    )
}
export default LoaderComponent