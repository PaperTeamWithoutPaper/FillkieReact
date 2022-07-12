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
export function setCurrentTeamID(teamID)
{
    return{
        type: 'SET_CURRENT_TEAMID',
        teamID
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
    currentTeamID:0,
    inviteUrl:'',
    teams:[
        {
            key:1,
            type:2,
            thumbnail:"",
            title:"A",
        },
        {
            key:2,
            type:2,
            thumbnail:"",
            title:"B",
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
        case 'SET_CURRENT_TEAMID':
            return{
                ...state,
                currentTeamID:action.teamID
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