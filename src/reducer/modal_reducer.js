export function setModalDesc(desc)
{
    return{
        type: 'SET_MODAL_DESC',
        desc
    }
}
export function isCreateAlarm(toggle)
{
    return{
        type: 'IS_CREATE_ALARM',
        toggle
    }
}

const initialState={
    desc:'',
    isCreate:0
}
export default function team_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_MODAL_DESC':
            return{
                ...state,
                desc:action.desc
            }
        case 'IS_CREATE_ALARM':
            return{
                ...state,
                isCreate:action.toggle
            }
      
        default:
            return state;
    }
}