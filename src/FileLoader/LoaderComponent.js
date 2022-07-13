import Appbar from "../Appbar/Appbar"
import DirectoryPath from "./Directory/DirectoryPath"
import Drive from "./Drive/Drive"
import './LoaderComponent.scss'
const LoaderComponent=()=>
{
    return(
        <div>
            <Appbar type={1}></Appbar>
            <div className="LoaderComponent-box">
                <DirectoryPath></DirectoryPath>
                <Drive></Drive>
            </div>
        </div>
    )
}
export default LoaderComponent