import axios from "axios";
import { getCookie } from "../../cookie";
export const axiosApi=(uri,options)=>{
    const instance = axios.create({
        baseURL: `https://api.fillkie.com/${uri}`,
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${getCookie("access")}`},
        ...options
})
    return instance
}