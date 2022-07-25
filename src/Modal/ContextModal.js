import "./ContextModal.scss"
import { useDispatch } from "react-redux"
import { IsCreateFile } from "../reducer/file_reducer";
const ContextModal=()=>
{
    const dispatch=useDispatch();
    return(
        <div className="contextModal-box">
        <div onClick={()=>{dispatch(IsCreateFile(1,0))}} className="contextModal-desc">노트 생성</div>
        <div className="contextModal-divide"></div>
        <div onClick={()=>{dispatch(IsCreateFile(1,1))}} className="contextModal-desc">폴더 생성</div>
        </div>
    )
}
export default ContextModal