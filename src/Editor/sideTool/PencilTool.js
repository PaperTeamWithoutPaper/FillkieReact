import { SketchPicker } from 'react-color'
import '../Editor.scss'
const PencilTool=({selectedStrokeWidth,setStrokeWidth,setSelectedStrokeWidth,strokePicker,setStrokePicker,strokeColor,setStrokeColor})=>
{
    console.log(selectedStrokeWidth)
    return(
        <div className="toolDetail" style={{transform:'translate(-25px,45px)'}}>
            <div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">굵기</div>
                    <div className="toolDetail-detailBox-buttonBox">
                        <button className={selectedStrokeWidth===0?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(1); setSelectedStrokeWidth(0)}}>
                            <div style={{borderRadius:'100px',width:'20px', height:'1px', backgroundColor:selectedStrokeWidth==0?'rgb(159,141,247)':'rgb(110, 110, 110)'}}></div>
                        </button>
                        <button className={selectedStrokeWidth===1?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(3);setSelectedStrokeWidth(1)}}>
                            <div style={{borderRadius:'100px',width:'20px', height:'3px', backgroundColor:selectedStrokeWidth==1?'rgb(159,141,247)':'rgb(110, 110, 110)'}}></div>
                        </button>
                        <button className={selectedStrokeWidth===2?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(5);setSelectedStrokeWidth(2)}}>
                            <div style={{borderRadius:'100px',width:'20px', height:'5px', backgroundColor:selectedStrokeWidth==2?'rgb(159,141,247)':'rgb(110, 110, 110)'}}></div>
                        </button>
                        <button className={selectedStrokeWidth===3?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(10);setSelectedStrokeWidth(3)}}>
                            <div style={{borderRadius:'100px',width:'20px', height:'10px', backgroundColor:selectedStrokeWidth==3?'rgb(159,141,247)':'rgb(110, 110, 110)'}}></div>
                        </button>
                    </div>
                </div>
                <div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">선 색상</div>
                        <div className="toolDetail-detailBox-buttonBox">
                            <div className="toolBox-colorBox">
                            <button onClick={()=>{setStrokePicker(1)}} style={{borderRadius: '100px', width:30,height:30,border:'1px solid lightgray',backgroundColor:`${strokeColor}`}}></button>
                            {strokePicker?
                                <div >
                                    <div onClick={()=>{setStrokePicker(0)}} style={{left:0, top:0,position:'fixed',width:'100vw',height:'100vh'}}></div>
                                    <div style={{position:'absolute',transform:'translate(0px,0px)'}}><SketchPicker color={strokeColor} onChange={(color)=>{setStrokeColor(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`)}}></SketchPicker></div>
                                </div>:null
                            }
                            </div>
                        </div>
                </div>
                
        </div>
    )
}
export default PencilTool