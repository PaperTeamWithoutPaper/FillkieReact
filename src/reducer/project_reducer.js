export function setProjectInfo(projects)
{
    return{
        type: 'SET_PROJECT_INFO',
        projects
    }
}

const initialState={
    projects:[
        {
            key:1,
            type:4,
            thumbnail:"",
            title:"Project1",
            desc:"프로젝트",
        },
       
    ],
}
export default function project_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_PROJECT_INFO':
            return{
                ...state,
                projects:action.projects
            }
        default:
            return state;
    }
}