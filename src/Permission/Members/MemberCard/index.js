import './MemberCard.scss'
import { useDispatch } from 'react-redux'
import { setPermissionDragFrom } from '../../../reducer/drag_reducer';
const MemberCard=({id,name,profile})=>
{
    const dispatch=useDispatch();
    const ondragstart=()=>
    {
        dispatch(setPermissionDragFrom(id))
    }
    const ondragend=()=>
    {

    }
    return(
        <div draggable
        onDragStart={ondragstart}
        onDragEnd={ondragend}
         className="MemberCard-body">
            <div className="MemberCard-padd"></div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTHUfpbfHayCUU074hh7qpmUxaWKN5bakTOOpVv3IVTu0wTIRbGlsRYqPehEtCnBcFIqc" className="MemberCard-profile">
            </img>
            <div className="MemberCard-name">
                {name}
            </div>
            <div className="MemberCard-group">
                bachelor
            </div>
        </div>
    )
}
export default MemberCard