export function setPermissionDragFrom(userId)
{
    return{
        type: 'SET_PERMISSION_DRAG_FROM',
        userId
    }
}
export function setPermissionDragTo(groupId)
{
    return{
        type: 'SET_PERMISSION_DRAG_TO',
        groupId
    }
}
const initialState={
   permissionFrom: 0,
   permissionTo:0,
}

export default function drag_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_PERMISSION_DRAG_FROM':
            return{
                ...state,
                permissionFrom:action.userId
            }
        case 'SET_PERMISSION_DRAG_TO':
            return{
                ...state,
                permissionTo:action.groupId
            }
      
        default:
            return state;
    }
}