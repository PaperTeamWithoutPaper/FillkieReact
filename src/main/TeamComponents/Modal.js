import ModalButton from "./ModalButton";

const Modal=(props)=>
{
    const ModalButtonOption=[{title:'▶︎ 팀 초대',type:0},{title:'▶︎ 팀 관리',type:1}]
    const listopen=props.listopen;
    return(
        <div className="Modal-active">
            {ModalButtonOption.map((option)=>{return(<ModalButton type={option.type} data={option.title}></ModalButton>)})}
        </div>
    )
}
export default Modal