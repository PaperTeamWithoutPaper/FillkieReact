import {axiosApi,axiosPost} from "../utils";
import axios from "axios";
import { getCookie } from "../../cookie";
export const getTeamList= async()=>{
    const {data}= await axiosApi('team/list').get()
    return data
}
export const getTeamDetail= async(id)=>{
    const {data}= await axiosApi(`team/detail?teamId=${id}`).get()
    return data
}
export const getTeamInviteUrl= async(id)=>{
    const {data}= await axiosApi(`team/invite?teamId=${id}`).get()
    return data
}
export const postCreateTeam= async(teamName)=>{
    const {data}= await axios({method:'post',baseURL:"https://api.fillkie.com/team/create",data:{"teamName":teamName},
    headers:{'Content-Type':'application/json',
    'Authorization':`${getCookie("access")}`}})
    return data
}