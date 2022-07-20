import './ToolBar.scss'

const ToolBar=()=>
{

    return(
        <div className="ToolBar-body">
            <div className="ToolBar-button" >
                <img className="ToolBar-button-icon" src={require('./Icons/erase.png')}></img>
                <div className="ToolBar-button-desc">handle</div>
            </div>
            <div className="ToolBar-button">
                <img className="ToolBar-button-icon" src={require('./Icons/edit.png')}></img>
                <div className="ToolBar-button-desc">Text</div>
            </div>
            <div className="ToolBar-button">
                <img className="ToolBar-button-icon" src={require('./Icons/draw.png')}></img>
                <div className="ToolBar-button-desc">Draw</div>
            </div>
            <div className="ToolBar-button">
                <img className="ToolBar-button-icon" src={require('./Icons/erase.png')}></img>
                <div className="ToolBar-button-desc">Erase</div>
            </div>
            


        </div>
    )
}
export default ToolBar