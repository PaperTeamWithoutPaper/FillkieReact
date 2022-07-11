export function setProjectInfo(teams)
{
    return{
        type: 'SET_TEAM_INFO',
        teams
    }
}
const initialState={
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
        default:
            return state;
    }
}