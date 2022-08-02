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

const initialState={
    groups:[],
    users:[]  
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
    
        default:
            return state;
    }
}