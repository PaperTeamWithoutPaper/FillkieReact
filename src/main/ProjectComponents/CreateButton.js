import { useState } from "react"
const CreateButton=()=>
{
    const [ishover,setIshover]=useState(0)
    return(
        <div className="CreateButton-body" onMouseOver={()=>{setIshover(1)}} onMouseOut={()=>{setIshover(0)}}>
            <div className="CreateButton-title">🎁 title</div>
            <div className={ishover?"CreateButton-shadow-active":"CreateButton-shadow-hidden"}></div>
            <div className={ishover?"CreateButton-desc-active":"CreateButton-desc-hidden"}>desc</div>
        </div>
    )
}
export default CreateButton