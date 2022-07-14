import './Alarm.scss'
import {useSelector,useDispatch} from 'react-redux'
import {useEffect, useState} from 'react'
import { isCreateAlarm } from '../reducer/modal_reducer'
const Alarm=()=>
{
    const [loading,setLoading]=useState(1)
    const dispatch=useDispatch()
    useEffect(()=>
    {
        setLoading(0)
        setTimeout(()=>{
            setLoading(1)
            setTimeout(()=>{dispatch(isCreateAlarm(0))},200)
           
    },3000)},[])
    
    const desc=useSelector((state)=>state.modal_reducer.desc)
    return(
        <div className={loading?"Alarm-loading":"Alarm"}>
            <div className="Alarm-desc">
                {desc}
            </div>
        </div>
    )
}
export default Alarm