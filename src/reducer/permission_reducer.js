export function setGroupList(groups)
{
    return{
        type: 'SET_GROUP_LIST',
        groups
    }
}
export function setGroupUsers(users)
{
    return{
        type: 'SET_GROUP_USER',
        users
    }
}
export function initGroupUsers(users)
{
    return{
        type: 'INIT_GROUP_USER',
        users
    }
}
export function initPermission()
{
    return{
        type: 'INIT_PERMISSION',
    }
}
export function changeGroup(userIdx,groupName,groupId)
{
    return{
        type: 'CHANGE_GROUP',
        userIdx,groupName,groupId
    }
}
export function setGroupPermission(groupId,permissionList)
{
    return{
        type: 'SET_GROUP_PERMISSION',
        groupId,permissionList
    }
}
export function setGroupPermissionEach(groupIdx,permissionIdx,toggle)
{
    return{
        type: 'SET_GROUP_PERMISSION_EACH',
        groupIdx,permissionIdx,toggle
    }
}
const initialState={
    groups:[],
    users:[],
    permission:{}
}
export default function permission_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_GROUP_LIST':
            return{
                ...state,
                groups:action.groups
            }
        case 'SET_GROUP_USER':
            return{
                ...state,
                users:state.users.concat(action.users)
            }
        case 'INIT_GROUP_USER':
            return{
                ...state,
                users:[]
            }
        case 'CHANGE_GROUP':
            const temp=[...state.users]
            temp[action.userIdx]['groupName']=action.groupName;
            temp[action.userIdx]['groupId']=action.groupId;
            return {
                ...state,
                users:temp
            }
        case 'SET_GROUP_PERMISSION_EACH':
            const tempb={...state.permission}
            tempb[action.groupIdx][action.permissionIdx]=action.toggle
            return{
                ...state,
                permission:tempb
            }
        case 'SET_GROUP_PERMISSION':   
            const tempc={...state.permission}
            tempc[action.groupId]=action.permissionList
            return{
                ...state,
                permission: tempc
            }
        case 'INIT_PERMISSION':
            return{
                ...state,
                permission:[]
            }
    
        default:
            return state;
    }
}