import { SketchPicker } from 'react-color'
import '../Editor.scss'
const TextTool=({selectedTextSize,setSelectedTextSize,setTextSize,fillColor,setFillColor,setFillPicker,fillPicker})=>
{
    return (
        <div className="toolDetail" style={{transform:'translate(110px,45px)'}}>
             <div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">텍스트 크기</div>
                    <div className="toolDetail-detailBox-buttonBox">
                        <button className={selectedTextSize===0?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(10); setSelectedTextSize(0)}}>
                            <div style={{fontWeight:'bold', color:selectedTextSize===0?'rgb(159,141,247)':'black'}}>S</div>
                        </button>
                        <button className={selectedTextSize===1?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(15);setSelectedTextSize(1)}}>
                            <div style={{fontWeight:'bold',color:selectedTextSize===1?'rgb(159,141,247)':'black'}}>M</div>
                        </button>
                        <button className={selectedTextSize===2?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(20);setSelectedTextSize(2)}}>
                            <div style={{fontWeight:'bold',color:selectedTextSize===2?'rgb(159,141,247)':'black'}}>L</div>
                        </button>
                        <button className={selectedTextSize===3?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(25);setSelectedTextSize(3)}}>
                            <div style={{fontWeight:'bold',color:selectedTextSize===3?'rgb(159,141,247)':'black'}}>XL</div>
                        </button>
                    </div>
                </div>

                <div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">텍스트 색</div>
                        <div className="toolDetail-detailBox-buttonBox">
                            <div className="toolBox-colorBox">
                                <button onClick={()=>{setFillPicker(1)}} style={{borderRadius: '100px', width:30,height:30,border:'1px solid lightgray',backgroundColor:`${fillColor}`}}></button>
                                {fillPicker?
                                    <div>
                                        <div onClick={()=>{setFillPicker(0)}} style={{left:0, top:0,position:'fixed',width:'100vw',height:'100vh'}}></div>
                                        <div style={{position:'absolute',transform:'translate(0px, 0px)'}}><SketchPicker color={fillColor} onChange={(color)=>{setFillColor(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`)}}></SketchPicker></div>
                                    </div>:null
                                }
                            </div>
                        </div>
                </div>

                
        </div>

    )
}
export default TextTool