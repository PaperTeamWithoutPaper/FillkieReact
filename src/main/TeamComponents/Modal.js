const Modal=(props)=>
{
    const k=['team profile','users']
    const listopen=props.listopen;
    return(
        <div className={listopen==1?"Modal-active" : "Modal-hidden"}>
            {k.map((a)=>{return(<div style={{fontSize:"20px", margin:'20px'}}>{a}</div>)})}

        </div>
    )
}
export default Modal