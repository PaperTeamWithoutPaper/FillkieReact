export function setUserInfo(email,profile)
{
    return{
        type: 'SET_USER_INFO',
        email,profile
    }
}
const initialState={
    user_email:'asd',
    user_profile:'asd',
}
export default function user_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_USER_INFO':
            return{
                ...state,
                user_email:action.email,
                user_profile:action.profile,
            }
        default:
            return state;
    }
}