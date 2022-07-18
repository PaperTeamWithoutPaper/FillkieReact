import {axiosApi} from "../utils";
export const getTeamList= async()=>{
    const {data}= await axiosApi('team/list').get()
    return data
}
export const getTeamDetail= async(id)=>{
    const {data}= await axiosApi(`team/detail?teamId=${id}`).get()
    return data
}