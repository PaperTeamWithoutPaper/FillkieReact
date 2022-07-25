const Loading=()=>
{
    return(
        <div>
            <img style={{transform:"translate(calc(50vw - 100%),calc(50vh - 100% + 80px))"}} src={require("./loading.gif")}></img>
        </div>
    )
}
export default Loading