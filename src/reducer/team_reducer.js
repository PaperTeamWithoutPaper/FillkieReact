export function setTeamInfo(teams)
{
    return{
        type: 'SET_TEAM_INFO',
        teams
    }
}
export function IsCreateTeam(toggle)
{
    return{
        type: 'IS_CREATE_TEAM',
        toggle
    }
}
export function IsInviteTeam(toggle)
{
    return{
        type: 'IS_INVITE_TEAM',
        toggle
    }
}
export function setCurrentTeam(idx)
{
    return{
        type: 'SET_CURRENT_TEAM',
        idx
    }
}
export function setInviteUrl(url)
{
    return{
        type: 'SET_INVITE_URL',
        url
    }
}
const initialState={
    creating:0,
    inviting:0,
    currentTeam:0,
    inviteUrl:'',
    teams:[
        {
            idx:0,
            id:0,
            thumbnail:"",
            title:"asd1",
        },
        {
            idx:1,
            id:1,
            thumbnail:"",
            title:"vsd2",
        }
    ],
}
export default function team_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_TEAM_INFO':
            return{
                ...state,
                teams:action.teams
            }
        case 'IS_CREATE_TEAM':
            return{
                ...state,
                creating:action.toggle
            }
        case 'IS_INVITE_TEAM':
            return{
                ...state,
                inviting:action.toggle
            }
        case 'SET_CURRENT_TEAM':
            return{
                ...state,
                currentTeam:action.idx
            }
        case 'SET_INVITE_URL':
            return{
                ...state,
                inviteUrl:action.url
            }
        default:
            return state;
    }
}