import axios from "axios";
import { getCookie } from "../../cookie";
export const axiosApi=(uri)=>{
    const instance = axios.create({
        baseURL: `https://api.fillkie.com/${uri}`,
        headers:{
            'Content-Type':'application/json',
            'Authorization':`${getCookie("access")}`},
})
    return instance
}
