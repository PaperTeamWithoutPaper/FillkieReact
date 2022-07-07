const Modal=(props)=>
{
    const k=['team profile','users','test']
    const listopen=props.listopen;
    return(
        <div className={listopen==1?"Modal-active" : "Modal-hidden"}>
            {k.map((a)=>{return(<div className="Modal-menu-normal">{a}</div>)})}

        </div>
    )
}
export default Modal