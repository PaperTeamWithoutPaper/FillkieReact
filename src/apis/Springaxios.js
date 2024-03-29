import axios from 'axios';
import { getCookie } from '../cookie';

const NODE_SERVER='https://api.fillkie.com/node';
const SPRING_SERVER='https://api.fillkie.com/spring';


const SpringAxios=()=>
{
    const springAxios = axios.create({
        baseURL: `${SPRING_SERVER}`, // 기본 서버 주소 입력
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${getCookie('access')}`,
        }})
    return springAxios
}
export default SpringAxios