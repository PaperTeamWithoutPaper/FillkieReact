import {useEffect, useLayoutEffect,useState,useRef, useSyncExternalStore} from 'react'
import {getMinMaxXY,getElementsAtPosition, drawSelectedBox, drawElement,createSelectingBox,createElement,getElementAtPosition,adjustElementCoordinates,cursorForPosition,resizeCoordinates} from './util'
import yorkie from 'yorkie-js-sdk'
import { useParams } from 'react-router'
import "./Editor.scss"
import { SketchPicker } from 'react-color'
import MousePointer from './Mouse'

var client=null;
var doc= null;
var canvas= null;
var context=null;
var pencilR=null;
var pencilStart=null;
const Editor=()=>
{
   

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
        const clientX=type=="des"?e.clientX:e.touches[0].clientX
        const clientY=type=="des"?e.clientY:e.touches[0].clientY 
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
                    drawSelectedBox(element,context,pencilRange)
                    const offsetX=pencilRange.x1-element.moveXY.x+(clientX-pencilRange.x1);
                    const offsetY=pencilRange.y1-element.moveXY.y+(clientY-pencilRange.y1);;
                    setSelectedElement({...element,offsetX,offsetY})
                }

                else{
                    drawSelectedBox(element,context)
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
        
        const clientX=type=="des"?e.clientX:e.touches[0].clientX
        const clientY=type=="des"?e.clientY:e.touches[0].clientY
       
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
                createSelectingBox(context,downPosition.x,downPosition.y,clientX,clientY)
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
                drawSelectedBox({tool,x1:newX,y1:newY,x2:newX+width,y2:newY+height},context)
            }
            else if(selectedElement.tool==='text')
            {
                const {index,x1,y1,tool,text} = selectedElement
                
                updateElement(index,x1+clientX-pencilStart.x,y1+clientY-pencilStart.y,null,null,tool,text);
                drawAll();
                drawSelectedBox({tool,x1:x1+clientX-pencilStart.x,y1:y1+clientY-pencilStart.y,x2:null,y2:null,width:selectedElement.width},context)
            }
            else if(selectedElement.tool==='pencil')
            {
                
                const {index,tool,offsetX,offsetY} = selectedElement
                const shape=doc.getRoot().shapes[index]
                
                movePencil(index,tool,clientX-offsetX,clientY-offsetY)
                drawAll();

                drawSelectedBox(selectedElement,context,{
                    x1:pencilR.x1+clientX-pencilStart.x,
                    y1:pencilR.y1+clientY-pencilStart.y,
                    x2:pencilR.x2+clientX-pencilStart.x,
                    y2:pencilR.y2+clientY-pencilStart.y})
            }
            
        }
        if(action==='resizing')
        {
            const {index,tool, ...coordinates} = selectedElement;
            const {x1,y1,x2,y2} = resizeCoordinates(clientX,clientY,selectedPosition,coordinates);
            updateElement(index, x1,y1,x2,y2, tool);
            drawAll();
            drawSelectedBox({tool,x1,y1,x2,y2},context)
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
            drawSelectedBox({tool:'rectangle',x1:minX,y1:minY,x2:maxX,y2:maxY},context)
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
        
        const root = doc.getRoot();
        
        context.clearRect(0,0,canvas.width,canvas.height);
        
        /*var img = new Image();
        img.src = 'https://placeimg.com/100/100/any';
        img.onload = function(){
        context.drawImage(img, 10, 10);
        }*/
        context.scale(window.devicePixelRatio,window.devicePixelRatio)
        root.shapes.forEach(element => drawElement(context, element));
        context.scale(1/window.devicePixelRatio,1/window.devicePixelRatio)
        

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
        
        
        if(client===null)
        {
            activateClient();   
        }
       
    },[]
    )


    useEffect(()=>
    {
        if(action==='writing')
        {
            console.log(action)
            setTimeout(()=>{textRef.current.focus()},1)
        }
    },[action,selectedElement])
    return(
        <div>
            
            {loading?<div>Loading</div>:null}
            {
            
            <canvas
            style={{
                width:`${window.innerWidth}px`,
                height:`${window.innerHeight-30}px`,
                display:`${loading?'none':'block'}`,
        }}
            id="canvas"
            width={window.innerWidth*window.devicePixelRatio}
            height={(window.innerHeight-30)*window.devicePixelRatio}
            onMouseDown={(e)=>{
                
                onmousedown(e,'des')}}
            onMouseMove={(e)=>{onmousemove(e,'des')}}
            onMouseUp={(e)=>{onmouseup(e,'des')}}
            onTouchStart={(e)=>{onmousedown(e,'mob')}}
            onTouchMove={(e)=>{onmousemove(e,'mob')}}
            onTouchEnd={(e)=>{onmouseup(e,'mob')}} >
            
            </canvas>}
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
                <button className={tool==='pencil'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('pencil')}}>그리기</button>
                <button className={tool==='line'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('line')}}>선</button>
                <button className={tool==='rectangle'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('rectangle')}}>직사각형</button>
                {<button className={tool==='text'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('text')}}>텍스트</button>}
                <button className={tool==='selection'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('selection')}}>선택</button>
                <button className={tool==='eraser'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('eraser')}}>지우개</button>
                <button className={tool==='asd'?"toolBox-button-active":"toolBox-button"} onClick={()=>{doc.update((root)=>root.shapes=[]);drawAll()}}>초기화</button>
                <div className="toolBox-colorBox">
                    <div className="toolBox-colorBox-desc">선</div>
                    <button onClick={()=>{setStrokePicker(1)}} style={{width:15,height:15,border:'1px solid white',backgroundColor:`${strokeColor}`}}></button>
                    {strokePicker?
                        <div style={{position:'absolute',top:0}}>
                            <div onClick={()=>{setStrokePicker(0)}} style={{left:0, top:0,position:'fixed',width:'100vw',height:'100vh'}}></div>
                            <div style={{position:'absolute',transform:'translate(-100px,50px)'}}><SketchPicker color={strokeColor} onChange={(color)=>{setStrokeColor(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`)}}></SketchPicker></div>
                        </div>:null
            }
                    
                </div>
                <div className="toolBox-colorBox">
                    <div className="toolBox-colorBox-desc">채우기</div>
                    <button onClick={()=>{setFillPicker(1)}} style={{width:15,height:15,border:'1px solid white',backgroundColor:`${fillColor}`}}></button>
                    {fillPicker?
                        <div style={{position:'absolute',top:0}}>
                            <div onClick={()=>{setFillPicker(0)}} style={{left:0, top:0,position:'fixed',width:'100vw',height:'100vh'}}></div>
                            <div style={{position:'absolute',transform:'translate(-100px,50px)'}}><SketchPicker color={fillColor} onChange={(color)=>{setFillColor(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`)}}></SketchPicker></div>
                        </div>:null
            }
                </div>
            </div>
            
            
            
        </div>
    )
}
export default Editor