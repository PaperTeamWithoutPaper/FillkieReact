import './save.scss'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getCookie } from '../../../cookie'
import { springAxios } from '../../../apis/api'
const SaveButton=()=>
{
    const [clicked,setClicked]=useState(0)
    const teamIdx=useSelector(state=>state.team_reducer.currentTeam)
    const teams=useSelector(state=>state.team_reducer.teams)
    const groups=useSelector(state=>state.permission_reducer.groups)
    const permission=useSelector(state=>state.permission_reducer.permission)
    const users=useSelector(state=>state.permission_reducer.users)
    const createBody=()=>
    {
        
        var userObj={}
        for(var i=0;i<users.length;i++)
        {
            try{
                userObj[users[i]['groupId']].push(users[i]['userId'])
            }
            catch{
                userObj[users[i]['groupId']]=[]
                userObj[users[i]['groupId']].push(users[i]['userId'])
            }
        }
        var body=[]
        var tempObject={}
        for(var i=0;i<groups.length;i++)
        {
            tempObject={}
            const groupId=groups[i]['groupId']
            tempObject['groupId']=groupId
            tempObject['permission']=permission[groupId]
            tempObject['userIds']=userObj[groupId]===undefined?[]:userObj[groupId]
            body.push(tempObject)
        }
        return body
    }
    const onclick=()=>
    {
        setClicked(1)
        const body=createBody()
        springAxios.put(`/permission/update/${teams[teamIdx]['teamId']}`,body)
    }
    return(
        <div className="save-body" onClick={onclick}>
            <img draggable={false} className="save-icon" src={require('./Icon/check.png')}></img>
            <div className="save-desc">save</div>
        </div>
    )
}
export default SaveButton