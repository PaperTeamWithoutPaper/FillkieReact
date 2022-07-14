import './Alarm.scss'
const Alarm=(props)=>
{
    const desc=props.desc
    return(
        <div className="Alarm">
            <div className="Alarm-desc">
                {desc}
            </div>
        </div>
    )
}
export default Alarm