import './MemberCard.scss'
const MemberCard=({id,name,profile})=>
{
    return(
        <div draggable className="MemberCard-body">
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