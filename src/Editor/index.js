import {useEffect, useLayoutEffect,useState,useRef} from 'react'
import {getMinMaxXY,getElementsAtPosition, drawSelectedBox, drawElement,createSelectingBox,createElement,getElementAtPosition,adjustElementCoordinates,cursorForPosition,resizeCoordinates} from './util'
import yorkie from 'yorkie-js-sdk'
import { useParams } from 'react-router'
import "./Editor.scss"
import { SketchPicker } from 'react-color'
import html2canvas from 'html2canvas'
import {toPdf} from './toPdf'
import MyDocument from './Pdf'
import Loading from '../Loading/Loading'

var client=null;
var doc= null;
var canvas= null;
var context=null;
var pencilR=null;
var pencilStart=null;

const Editor=()=>
{
    //canvas pages//
    const [pageNum,setPageNum]=useState(4)
    //canvas position//
    const [canvasX,setCanvasX]=useState(0)
    var cx=0
    var tcx=0
    const [canvasY,setCanvasY]=useState(0)
    var cy=0
    var tcy=0
    //scale//
    var scp=1
    const [scalePer,setScalePer]=useState(1)
    //color//
    const [strokePicker,setStrokePicker]=useState(0)
    const [fillPicker,setFillPicker]=useState(0)
    const [strokeColor,setStrokeColor]=useState('black')
    const [fillColor,setFillColor]=useState('black')
    const [currentTextColor,setCurrentTextColor]=useState('black')
    //ref//
    const textRef=useRef();
    //path var//
    const {docKey}=useParams()

    const [users,setUsers]=useState([])
    const [tool,setTool]=useState('pencil')
    const [action,setAction]=useState('none')
    const [selectedElement,setSelectedElement]=useState(null);
    const [selectedPosition, setSelectedPosition]=useState(null);
    const [loading, setLoading]= useState(0);
    const [downPosition,setDownPosition]=useState({x:0,y:0})
    //const [eraseList,setEraseList]=useState([]);

    const movePencil=(index,tool,offsetX,offsetY)=>
    {
        doc.update((root)=>
        {
            root.shapes[index].moveXY.x=offsetX
            root.shapes[index].moveXY.y=offsetY
        })
    }
    const removeElement=(element)=>
    {
        
        doc.update((root)=>{
            root.shapes[element.index].removed=true
            }
            )
    }
    const updateElement=(index,x1,y1,x2,y2,tool,text)=>
    {
        switch (tool)
        {
            case "line":
            case "rectangle":  
                doc.update((root)=>{
                root.shapes[index].index=index
                root.shapes[index].x1=x1
                root.shapes[index].y1=y1
                root.shapes[index].x2=x2
                root.shapes[index].y2=y2
                }
                )
                break;
            case "pencil":
                doc.update((root)=>
                root.shapes[index].points.push({x: x2,y: y2}))
                break;
            case "text":
                doc.update((root)=>{
                    root.shapes[index].index=index
                    root.shapes[index].x1=x1
                    root.shapes[index].y1=y1
                    root.shapes[index].text=text
                    root.shapes[index].width=context.measureText(text).width
                    root.shapes[index].height=15
                })
                
                break;
            default:
                throw new Error(`Type not recognized ${tool}`)
        }
        
        
    }

    const onmousedown=(e,type)=>
    {
        if(textRef.current) return
        const ratioX=((scalePer-1)/scalePer)
        const ratioY=((scalePer-1)/scalePer)
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.touches[0].clientX-canvasX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.touches[0].clientY-canvasY

        setDownPosition({x:clientX,y:clientY})  
        const id = doc.getRoot().shapes.length;
        drawAll()
        if(tool==='selection')
        {
            const getElement=getElementAtPosition(clientX,clientY,doc.getRoot().shapes)
            if(getElement)
            {
                const {element,position,pencilRange}=getElement
                pencilR=pencilRange
                setSelectedPosition(position)
                if(element.tool=='pencil')
                {
                    pencilStart={x:clientX,y:clientY}

                    context.scale(window.devicePixelRatio,window.devicePixelRatio)
                    drawSelectedBox(element,context,pencilRange)
                    context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
                    const offsetX=pencilRange.x1-element.moveXY.x+(clientX-pencilRange.x1);
                    const offsetY=pencilRange.y1-element.moveXY.y+(clientY-pencilRange.y1);;
                    setSelectedElement({...element,offsetX,offsetY})
                }

                else{
                    context.scale(window.devicePixelRatio,window.devicePixelRatio)
                    drawSelectedBox(element,context,pencilRange)
                    context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
                    const offsetX=clientX-element.x1;
                    const offsetY=clientY-element.y1;
                    setSelectedElement({...element,offsetX,offsetY})
                    if(element.tool=='text')
                    {
                        pencilStart={x:clientX,y:clientY}
                    }
                }
                
                
                if(position==="inside")
                {
                    setAction('moving')
                }
                else
                {
                    setAction("resizing")
                }
            }
            else{
                setAction("selecting")
            }
    
        }
        else if(tool==='eraser')
        {
            setAction('erasing')
        }
        else{
            setAction(tool=== "text"?"writing":'drawing');
   
            const element=createElement(id,clientX,clientY,clientX,clientY,tool,strokeColor,fillColor)
            setSelectedElement(element)
            setCurrentTextColor(fillColor)
            doc.update((root)=>{
                root.shapes.push(element);
                }
            )
           
            drawAll()
        }
    }
    const onmousemove=(e,type)=>
    {
        const ratioX=((scalePer-1)/scalePer)
        const ratioY=((scalePer-1)/scalePer)
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.touches[0].clientX-canvasX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.touches[0].clientY-canvasY
       
        if(tool === 'selection')
        {
            if(action !== 'selecting')
            {
                const elements=doc.getRoot().shapes;
                const element = getElementAtPosition(clientX,clientY,elements)
                e.target.style.cursor = element ? cursorForPosition(element.position): "default"
            }
            else{
                drawAll()
                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                createSelectingBox(context,downPosition.x,downPosition.y,clientX,clientY)
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
            }
        }
        
        if(action==='drawing')
        { 
            const elements=doc.getRoot().shapes;
            const index=elements.length-1;
            const {x1,y1}=elements[index];
            updateElement(index,x1,y1,clientX,clientY,tool)
            drawAll()
            
        }
        if(action==='erasing')
        {
            const elements=doc.getRoot().shapes;
            const element = getElementAtPosition(clientX,clientY,elements)
            if(element)
            {
                removeElement(element.element)
                drawAll()
            }
            
        }
        if(action==='moving')
        {
            
            if(selectedElement.tool==='line' || selectedElement.tool === "rectangle")
            {
                const {index,x1,x2,y1,y2,tool,offsetX,offsetY} = selectedElement
                const width=x2-x1;
                const height=y2-y1;
                const newX=clientX-offsetX
                const newY=clientY-offsetY
                
                updateElement(index,newX,newY,newX+width,newY+height,tool);
                drawAll();
                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                drawSelectedBox({tool,x1:newX,y1:newY,x2:newX+width,y2:newY+height},context)
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))

            }
            else if(selectedElement.tool==='text')
            {
                const {index,x1,y1,tool,text} = selectedElement
                
                updateElement(index,x1+clientX-pencilStart.x,y1+clientY-pencilStart.y,null,null,tool,text);
                drawAll();
                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                drawSelectedBox({tool,x1:x1+clientX-pencilStart.x,y1:y1+clientY-pencilStart.y,x2:null,y2:null,width:selectedElement.width},context)
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))

            }
            else if(selectedElement.tool==='pencil')
            {
                
                const {index,tool,offsetX,offsetY} = selectedElement
                const shape=doc.getRoot().shapes[index]
                
                movePencil(index,tool,clientX-offsetX,clientY-offsetY)
                drawAll();

                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                drawSelectedBox(selectedElement,context,{
                    x1:pencilR.x1+clientX-pencilStart.x,
                    y1:pencilR.y1+clientY-pencilStart.y,
                    x2:pencilR.x2+clientX-pencilStart.x,
                    y2:pencilR.y2+clientY-pencilStart.y})
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))

            }
            
        }
        if(action==='resizing')
        {
            const {index,tool, ...coordinates} = selectedElement;
            const {x1,y1,x2,y2} = resizeCoordinates(clientX,clientY,selectedPosition,coordinates);
            updateElement(index, x1,y1,x2,y2, tool);
            drawAll();
            context.scale(window.devicePixelRatio,window.devicePixelRatio)    
            drawSelectedBox({tool,x1,y1,x2,y2},context)
            context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
        }
       
        
    }
    const onmouseup=(e,type)=>
    {
        const clientX=type=="des"?e.clientX:e.touches[0].clientX
        const clientY=type=="des"?e.clientY:e.touches[0].clientY
        const elements=doc.getRoot().shapes
        if(action==='selecting')
        {
            
            const adjustXY=adjustElementCoordinates({tool:'rectangle',x1:downPosition.x,y1:downPosition.y,x2:clientX,y2:clientY});
            
            const indexList=getElementsAtPosition(elements,adjustXY.x1,adjustXY.y1,adjustXY.x2,adjustXY.y2)
            if(indexList===undefined || indexList.length===0)
            {
                drawAll();
                setAction('none')
                return;
            }
            const {minX,minY,maxX,maxY} = getMinMaxXY(elements,indexList)

            
            drawAll()
            /*const spx=Math.min(downPosition.x,clientX)
            const spy=Math.min(downPosition.y,clientY)
            const epx=Math.max(downPosition.x,clientX)
            const epy=Math.max(downPosition.y,clientY)
            html2canvas(document.body,{x:spx,y:spy,width:epx-spx,height:epy-spy}).then(function(canvas) {
                document.body.appendChild(canvas);
            }); CAPTURE CODE*/
            context.scale(window.devicePixelRatio,window.devicePixelRatio)   
            drawSelectedBox({tool:'rectangle',x1:minX,y1:minY,x2:maxX,y2:maxY},context)
            context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
        }
        if(action === 'drawing' && (tool==='rectangle' || tool === 'line')){
            const index = doc.getRoot().shapes.length-1
            const {x1,y1,x2,y2}=adjustElementCoordinates(doc.getRoot().shapes[index]);
            updateElement(index, x1,y1,x2,y2,tool)
            setTool('selection')
        }
        if( action ==='resizing')
        {
            const index = selectedElement.index           
            const {x1,y1,x2,y2} = adjustElementCoordinates(doc.getRoot().shapes[index]);
            updateElement(index, x1,y1,x2,y2,selectedElement.tool)
        }    
        if(action==='writing') 
        {
        return
        }
        
        setAction('none')
        setSelectedElement(null);
    }
    const onblur=(e)=>
    {
        const {index, x1,y1,tool} = selectedElement;
        console.log(e.target.value)
        if(e.target.value==="")
        {
            removeElement(selectedElement)
        }
        else
        {
            updateElement(index,x1,y1,null,null,tool,e.target.value)
        }
        setAction('selecct')
        e.target.value=""
        drawAll();
    }


    //캔버스 생성//
    function drawAll()
    {
        if(doc==null) return
        const root = doc.getRoot();
        
        context.clearRect(0,0,canvas.width,canvas.height);
        
        /*var img = new Image();
        img.src = 'https://placeimg.com/100/100/any';
        img.onload = function(){
        context.drawImage(img, 10, 10);
        }*/
        context.scale(window.devicePixelRatio,window.devicePixelRatio)
        root.shapes.forEach(element => drawElement(context, element));
        context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
        

    }
    
    //Yorkie//
    async function activateClient()
    {
     
            setLoading(1)
            client = new yorkie.Client(`https://api.fillkie.com`)
            console.log(client)
            await client.activate();   
            doc = new yorkie.Document(docKey);   
            await client.attach(doc);
            subscribeDoc();   
            doc.update((root) => {
                if(root.shapes)
                {
                    return
                }
                root.shapes=[]



                });
            setLoading(0)
            
            drawAll()
            
            
            
    }


    function subscribeDoc()
    {
        
        doc.subscribe((event) => {
            if (event.type === 'remote-change') {
                drawAll()
            }
            });

        client.subscribe((event) => {
            
            if (event.type === 'peers-changed') {
                setUsers(Object.keys(event.value[`${docKey}`]))
                console.log(Object.keys(event.value[`${docKey}`]))
            } else if (event.type === 'stream-connection-status-changed') {
                
            }
            });
            
        
    }
    useLayoutEffect(()=> {
        canvas=document.getElementById('canvas');
        context=canvas.getContext('2d');
        window.addEventListener("wheel",function(e){e.preventDefault()},{passive: false})
        const frame=document.getElementById('frame');
        frame.addEventListener("wheel", function(e){
            e.preventDefault();
            if (e.ctrlKey) {
                if(scp-e.deltaY/200>=0.2 && scp-e.deltaY/200<=2)
                {
                    const ratioX=((scp-1)/scp)
                    const ratioY=((scp-1)/scp)
                    const clientX=e.clientX-cx*(1/scp)-e.clientX*ratioX
                    const clientY=e.clientY-cy*(1/scp)-e.clientY*ratioY
    
                    scp-=e.deltaY/200
                    setScalePer(scp)
                    cx+=(e.deltaY/200)*clientX
                    cy+=(e.deltaY/200)*clientY
                    setCanvasX(cx)
                    setCanvasY(cy)
                    
                 
                }
                
             
              
            } else {
  
                cx-=e.deltaX
                cy-=e.deltaY

              setCanvasY(cy)
              setCanvasX(cx)

            }
          }, {passive: false})

        
        if(client===null)
        {
            activateClient();   
        }
       
    },[]
    )
    useEffect(()=>
    {
        drawAll()
    },[pageNum])
    useEffect(()=>
    {
        if(action==='writing')
        {
            console.log(action)
            setTimeout(()=>{textRef.current.focus()},1)
        }
    },[action,selectedElement])
    useEffect(()=>
    {
        if(scalePer!=0)
        {
            drawAll()
        }
        
    },[scalePer])
    return(
        <div>
            
            {loading?<Loading></Loading>:null}
            {
            <div id="frame" style={{transform:'translateY(0px)',overflow:'hidden', backgroundColor:'lightgray',width:`${window.innerWidth}px`, height:`${window.innerHeight}px`}}>
                <div style={{transformOrigin: 'left' | 'top', transform: `translate(${canvasX}px,${canvasY}px) scale(${scalePer})`}}>
                <MyDocument></MyDocument>
                </div>
                <div style={{
                    transformOrigin: 'top left',
                    transform: `translate(${canvasX}px,${canvasY}px) scale(${scalePer})`,
                }}>
                <canvas
                style={{
      
                    
                    
                    width:`${window.innerHeight*(21.59/28.25)}px`,
                    height:`${window.innerHeight*pageNum}px`,
                    display:`${loading?'none':'block'}`,
            }}
                id="canvas"
                width={window.innerHeight*(21.59/28.25)*window.devicePixelRatio}
                height={(window.innerHeight*pageNum)*window.devicePixelRatio}
                onMouseDown={(e)=>{
                    
                    onmousedown(e,'des')}}
                
                onMouseMove={(e)=>{onmousemove(e,'des')}}
                onMouseUp={(e)=>{onmouseup(e,'des')}}
                onTouchStart={(e)=>{onmousedown(e,'mob')}}
                onTouchMove={(e)=>{onmousemove(e,'mob')}}
                onTouchEnd={(e)=>{onmouseup(e,'mob')}} >
                
                </canvas>
                </div>
                
            </div>
            }
            {
                action === "writing"?
            <textarea
            
            onBlur={(e)=>{onblur(e)}}
            style={{
                position:'fixed', 
                top:selectedElement.y1-2,
                left:selectedElement.x1,
                font: "15px serif",
                margin: 0,
                padding:0,
                border:0,
                outline: 0,
                resize: 'auto',
                overflow: 'hiddent',
                whiteSpace: 'pre',
                background: 'transparent',
                color: fillColor
    }}
            ref={textRef}></textarea>:null

            }  
            <div style={{position:'absolute', right:'10px', top:'50px'}}>
                <div>사용자</div>
                
                {users.map((user,key)=>{return(<div key={user}>{user}asd</div>)})}

            </div>
            {/*users.map((user,index)=>{
                if(index===0) return
                const l= user in Object.keys(doc.getRoot().mouse)?doc.getRoot().mouse[user].left:0
                const t=user in Object.keys(doc.getRoot().mouse)?doc.getRoot().mouse[user].top:0
            return(<MousePointer color="yellow" left={l} top={t}></MousePointer>)})*/}
            <div className="toolBox">
                <button className={tool==='pencil'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('pencil')}}>
                    <img className={tool==='pencil'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-draw.png")}></img>
                </button>
                <button className={tool==='line'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('line')}}>
                    <img className={tool==='line'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-shape.png")}></img>
                </button>
                <button className={tool==='rectangle'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('rectangle')}}>
                    <img className={tool==='rectangle'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-shape.png")}></img>    
                </button>
                {<button className={tool==='text'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('text')}}>
                    <img className={tool==='text'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-text.png")}></img>
                </button>}
                <button className={tool==='selection'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('selection')}}>
                <img className={tool==='selection'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-select.png")}></img>
                </button>
                <button className={tool==='eraser'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('eraser')}}>
                <img className={tool==='eraser'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-eraser.png")}></img>
                </button>
                <button className={tool==='asd'?"toolBox-button-active":"toolBox-button"} onClick={()=>{doc.update((root)=>root.shapes=[]);drawAll()}}>초기화</button>
                <div className="toolBox-colorBox">

                    <button onClick={()=>{setStrokePicker(1)}} style={{width:15,height:15,border:'1px solid black',backgroundColor:`${strokeColor}`}}></button>
                    {strokePicker?
                        <div style={{position:'absolute',top:0}}>
                            <div onClick={()=>{setStrokePicker(0)}} style={{left:0, top:0,position:'fixed',width:'100vw',height:'100vh'}}></div>
                            <div style={{position:'absolute',transform:'translate(-100px,50px)'}}><SketchPicker color={strokeColor} onChange={(color)=>{setStrokeColor(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`)}}></SketchPicker></div>
                        </div>:null
            }
                    
                </div>
                <div className="toolBox-colorBox">
                    
                    <button onClick={()=>{setFillPicker(1)}} style={{width:15,height:15,border:'1px solid black',backgroundColor:`${fillColor}`}}></button>
                    {fillPicker?
                        <div style={{position:'absolute',top:0}}>
                            <div onClick={()=>{setFillPicker(0)}} style={{left:0, top:0,position:'fixed',width:'100vw',height:'100vh'}}></div>
                            <div style={{position:'absolute',transform:'translate(-100px,50px)'}}><SketchPicker color={fillColor} onChange={(color)=>{setFillColor(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`)}}></SketchPicker></div>
                        </div>:null
            }
                </div>
                <div className="toolBox-button" onClick={()=>{toPdf(canvas)}}>
                    <div>다운로드</div>
                </div>
                <div className="toolBox-button" onClick={()=>{setPageNum(pageNum+1)}}>
                    <div>페이지추가</div>
                </div>
            </div>
            
            
            
        </div>
    )
}
export default Editor