export function setProjectInfo(projects)
{
    return{
        type: 'SET_PROJECT_INFO',
        projects
    }
}
export function IsCreateProject(toggle)
{
    return{
        type: 'IS_CREATE_PROJECT',
        toggle
    }
}
const initialState={
    iscreate:0,
    projects:[

        {id: '62de3e6e7f46db442eb91f0c', name: 'asdz', ownerId: '62db8bf3fe1996558d3ab045', teamId: '62db8c0efe1'}
       
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
        case 'IS_CREATE_PROJECT':
            return{
                ...state,
                iscreate:action.toggle
            }
        default:
            return state;
    }
}