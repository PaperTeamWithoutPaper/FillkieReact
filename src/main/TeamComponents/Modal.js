import ModalButton from "./ModalButton";

const Modal=(props)=>
{
    const ModalButtonOption=[{title:'Team Invite',type:0},{title:'Team Manage',type:1}]
    const listopen=props.listopen;
    return(
        <div className={listopen==1?"Modal-active" : "Modal-hidden"}>
            {ModalButtonOption.map((option)=>{return(<ModalButton type={option.type} data={option.title}></ModalButton>)})}
        </div>
    )
}
export default Modal