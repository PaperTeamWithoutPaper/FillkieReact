import ToolBar from "./ToolBar"
import DrawingBoard from "./DrawingBoard"
const Editor=()=>
{

    return(
        <div>
            <ToolBar></ToolBar>
            <DrawingBoard width={500} height={500}/>
        </div>
    )
}
export default Editor