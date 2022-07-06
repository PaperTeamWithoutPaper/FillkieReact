import { useState } from 'react'
import Modal from './Modal'
const TeamList=()=>
{
    const [listopen,setListopen]=useState(-1)
    return(
        <div>
        <div className="TeamList-body" onClick={()=>{setListopen(listopen*(-1))}}>
            <div className="TeamList-upperblock">
                <div className="TeamList-name">Kimchi Team</div>
                <img src={require('./icon/arrow.png')} className={listopen==-1?"TeamList-icon-lower":"TeamList-icon-upper"}></img>
            </div>
            <div className="TeamList-lowerblock">
                <div className="TeamList-users">8-users</div>
            </div>
            
        </div>
        <Modal listopen={listopen}></Modal>
        </div>
    )
}
export default TeamList