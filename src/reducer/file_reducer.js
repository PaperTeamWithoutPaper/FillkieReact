export function setPathTree(files)
{
    return{
        type: 'SET_PATH_TREE',
        files
    }
}
export function setDirWidth(width)
{
    return{
        type: 'SET_DIR_WIDTH',
        width
    }
}
export function IsCreateFile(toggle,typ)
{
    return{
        type: 'IS_CREATE_FILE',
        toggle,typ
    }
}
export function setFileInfo(data)
{
    return{
        type: 'SET_FILE_INFO',
        data
    }
}

export function setDirInfo(data)
{
    return{
        type: 'SET_DIR_INFO',
        data
    }
}
export function fileLoading(toggle)
{
    return{
        type: 'FILE_LOADING',
        toggle
    }
}


const initialState={
    iscreate:0,
    fileLoading:0,
    typ:0,
    width:200,
    files:[{}
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
        case 'SET_DIR_WIDTH':
            return{
                ...state,
                width:action.width
            }
        case 'IS_CREATE_FILE':
            return{
                ...state,
                typ:action.typ,
                iscreate:action.toggle
            }
        case 'SET_FILE_INFO':
            return{
                ...state,
                files:action.data
            }
        case 'FILE_LOADING':
            return{
                ...state,
                fileLoading:action.toggle
            }
      
        default:
            return state;
    }
}