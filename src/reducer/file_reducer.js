export function setPathTree(files)
{
    return{
        type: 'SET_PATH_TREE',
        files
    }
}

const initialState={
    files:[
        {
            key:1,
            type:1,
            thumbnail:"",
            title:"File1",
            desc:"파일1",
        },
        {
            key:2,
            type:1,
            thumbnail:"",
            title:"File2",
            desc:"파일2",
        },
        {
            key:3,
            type:2,
            thumbnail:"",
            title:"Dir1",
            desc:"폴더1",
        },
    ],
}
export default function team_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_PATH_TREE':
            return{
                ...state,
                files:action.files
            }
      
        default:
            return state;
    }
}