const sideTool=()=>
{
    return(
        {/*사이드 툴바 */}
            {tool!=='selection' && tool!=='eraser'?
            <div className="toolDetail"
            style={{transform: `translate(${sideToolX}px,55px)`}}>
                {tool==='line' || tool==='rectangle'?
                <div className="toolDetail-detailBox">
                        <div className="toolDetail-detailBox-desc">도형</div>
                        <div className="toolDetail-detailBox-buttonBox">
                            <button className={selectedShape===0?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setSelectedShape(0);setTool('line')}}>
                                <div style={{borderRadius:'100px',width:'20px', height:'3px', backgroundColor:selectedShape==0?'rgb(159,141,247)':'rgb(110, 110, 110)'}}></div>
                            </button>
                            <button className={selectedShape===1?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setSelectedShape(1); setTool('rectangle')}}>
                                <div style={{borderRadius:'2px',margin:'2.5px',width:'15px', height:'15px', outline: selectedShape==1?'solid 2px rgb(159,141,247)':'solid 2px rgb(110, 110, 110)'}}></div>
                            </button>
                            
                        </div>
                </div>:null
                }
                
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
                {tool!=='text'?
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
                </div>:null
                }   
                
                {tool==='rectangle' || tool==='text'?<div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">{tool==='text'?'텍스트 색':'배경 색'}</div>
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
                </div>:null}
                {tool==='text'?<div className="toolDetail-detailBox">
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
                        
                </div>:null}
                </div>
                :null}
             

    )
}