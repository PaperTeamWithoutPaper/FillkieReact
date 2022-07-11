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
const initialState={
    creating:0,
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
        default:
            return state;
    }
}