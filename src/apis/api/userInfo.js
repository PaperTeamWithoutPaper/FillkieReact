import {axiosApi} from "../utils";
export const getUserInfo= async()=>{
    const {data}= await axiosApi('user/profile').get()
    return data
}