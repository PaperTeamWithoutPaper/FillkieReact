import './PermissionCard.scss'
import ToggleBar from './toggle'
const PermissionCard=()=>
{
    const permission=['READ','WRITE','CREATE','DELETE','BAN','INVITE']
    return(
        <div className="PermissionCard-body">
            <div className="PermissionCard-padd"></div>

            <div style={{width:'20px'}}></div>
            <div className="PermissionCard-box">
                <div className="PermissionCard-desc"> GROUP</div>
                <div className="PermissionCard-groupName">manager</div>
            </div>
            
            <div style={{width:'30px'}}></div>
            <div className="PermissionCard-padd2"></div>
            {permission.map((data)=>{return(
                <div className="PermissionCard-box" style={{transform:'translateX(30px)'}}>
                <div className="PermissionCard-desc">{data}</div>
                    <ToggleBar></ToggleBar>
                </div>
               
            )})}
            
      
        </div>
    )
}
export default PermissionCard