import ModalButton from "./ModalButton";

const Modal=(props)=>
{
    const ModalButtonOption=['Team profile','Users']
    const listopen=props.listopen;
    return(
        <div className={listopen==1?"Modal-active" : "Modal-hidden"}>
            {ModalButtonOption.map((option)=>{return(<ModalButton data={option}></ModalButton>)})}
        </div>
    )
}
export default Modal