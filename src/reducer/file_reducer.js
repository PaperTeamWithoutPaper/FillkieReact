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
export function setFileInfo(parentId,data)
{
    return{
        type: 'SET_FILE_INFO',
        parentId,data
    }
}

export function setDirInfo(data)
{
    return{
        type: 'SET_DIR_INFO',
        data
    }
}
export function setRootInfo(data)
{
    return{
        type: 'SET_ROOT_INFO',
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
export function setCurDir(dirId)
{
    return{
        type: 'SET_CUR_DIR',
        dirId
    }
}
export function setDragFrom(id)
{
    return{
        type: 'SET_DRAG_FROM',
        id
    }

    
}


const initialState={
    iscreate:0,
    fileLoading:0,
    typ:0,
    width:200,
    rootfiles:[{}],
    dirId:0,
    files:{},
    dragFromId:0,
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
            const temp={...state.files}
            temp[action.parentId]=action.data
            return{
                ...state,
                files:temp
            }
        case 'SET_ROOT_INFO':
            return{
                ...state,
                rootfiles:action.data
            }
        case 'FILE_LOADING':
            return{
                ...state,
                fileLoading:action.toggle
            }
        case 'SET_CUR_DIR':
            return{
                ...state,
                dirId:action.dirId
            }
        case 'SET_DRAG_FROM':
            return{
                ...state,
                dragFromId:action.id
            }
        
      
        default:
            return state;
    }
}