import {useEffect, useLayoutEffect,useState,useRef,useCallback} from 'react'
import {getMinMaxXY,getElementsAtPosition, drawSelectedBox, drawElement,createSelectingBox,createElement,getElementAtPosition,adjustElementCoordinates,cursorForPosition,resizeCoordinates} from './util'
import yorkie from 'yorkie-js-sdk'
import { useParams } from 'react-router'
import "./Editor.scss"
import { SketchPicker } from 'react-color'
import html2canvas from 'html2canvas'
import {toPdf} from './toPdf'
import MyDocument from './Pdf'
import Loading from './Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import { setUserInfo } from '../reducer/user_reducer'
import { springAxios } from '../apis/api'
import { useLocation } from 'react-router-dom';
import QuickPinchZoom from "../react-quick-pinch-zoom"
import {useMediaQuery} from 'react-responsive'
import { contextType } from 'react-copy-to-clipboard'
import PencilTool from './sideTool/PencilTool'
import ShapeTool from './sideTool/ShapeTool'
import TextTool from './sideTool/TextTool'
var client=null;
var doc= null;
var canvas= null;
var context=null;
var pencilR=null;
var pencilStart=null;
var myFont=null;
var handle=null;
var temp=0
var _ratioScale=0;
var saveCanvasX=0;
var saveCanvasY=0;
const Editor=()=>
{
    //selectBox//

    //ratioScale//
    const [ratioScale,setRatioScale]=useState(0)
    //canvasXVScale/
    const canvasRef=useRef()
    //responsive//
    const resp= useMediaQuery({ query: '(max-width: 800px)' })
    //move//
    const [isMove,setIsMove]=useState(-1)
    //navigate//
    const location = useLocation();
    const myPdf=location.state?location.state.pdf:null;
    //redux//
    const dispatch=useDispatch()
    const { user_email, user_profile } = useSelector(state => ({
        user_email: state.user_reducer.user_email,
        user_profile: state.user_reducer.user_profile
      }));
    //mousePos//
    const [mouses,setMouses]=useState({})
    //selecting//
    const [selectedObjects,setSelectedObjects]=useState([])
    const [selectedObjPosition,setSelectedObjPosition]=useState({x1:0,y1:0,x2:0,y2:0})
    const [selectedObjIdx,setSelectedObjIdx]=useState([])
    const moveElement=(element,clientX,clientY,flag)=>
    {
        console.log(element)
        //  return {index,x1,y1,x2,y2,tool,removed:false,strokeColor,fillColor,strokeWidth}
        //case 'pencil':
        //    return {index, points: [{x:x1,y:y1}],tool,moveXY:{x:4,y:0},removed:false,strokeColor,strokeWidth}
        //case 'text':
        //    return {index, x1,y1,tool,removed:false,text:'',width:0,height:30,fillColor,fontSize,font}
        if(element.tool==='line' || element.tool === "rectangle")
            {
                const {index,x1,x2,y1,y2,tool,offsetX,offsetY} = element
                const width=x2-x1;
                const height=y2-y1;
                const newX=clientX-offsetX
                const newY=clientY-offsetY
                //
                updateElement(index,newX,newY,newX+width,newY+height,tool);
                drawAll();
                if(flag=='each')
                {
                    
                    drawSelectedBox({tool,x1:newX,y1:newY,x2:newX+width,y2:newY+height},context,null,ratioScale)
        

                }
                
            }
            else if(element.tool==='text')
            {
                
                const {index,x1,y1,tool,text,offsetX,offsetY} = element
                

                const newX=clientX-offsetX
                const newY=clientY-offsetY

                updateElement(index,newX,newY,null,null,tool,text);
                drawAll();
                if(flag=='each')
                {
       
                drawSelectedBox({tool,x1:x1+clientX-pencilStart.x,y1:y1+clientY-pencilStart.y,x2:null,y2:null,width:element.width},context,null,ratioScale)

                }

            }
            else if(element.tool==='pencil')
            {
                const {index,tool,offsetX,offsetY} = element
                console.log(offsetX,offsetY)
                movePencil(index,tool,clientX-offsetX,clientY-offsetY)
                drawAll();

                if(flag=='each')
                {
         
                drawSelectedBox(element,context,{
                    x1:pencilR.x1+clientX-pencilStart.x,
                    y1:pencilR.y1+clientY-pencilStart.y,
                    x2:pencilR.x2+clientX-pencilStart.x,
                    y2:pencilR.y2+clientY-pencilStart.y},ratioScale)
                }
                

            }
            if(flag=='all')
        {
            const diffX=downPosition.x-clientX
            const diffY=downPosition.y-clientY
          
            drawSelectedBox({tool:'rectangle',x1:selectedObjPosition.x1-diffX,y1:selectedObjPosition.y1-diffY,x2:selectedObjPosition.x2-diffX,y2:selectedObjPosition.y2-diffY},context,null,ratioScale)

        }
    }
    //tool detail//
    const [toolUp,setToolUp]=useState(0)

    //canvas pages//
    const pageNum=useSelector(state=>state.pdf_reducer.pages)
    const [newPage,setNewPage]=useState(0)
    //canvas position//
    const [canvasX,setCanvasX]=useState(0)

    const [canvasY,setCanvasY]=useState(0)
    //scale//
    var scp=1
    const [scalePer,setScalePer]=useState(1)
    //textSize//
    const [selectedTextSize,setSelectedTextSize]=useState(0)
    const [textSize, setTextSize]=useState(10)
    //shape//
    const [selectedShape,setSelectedShape]=useState(0)
    //strokeWidth//
    const [strokeWidth,setStrokeWidth]=useState(1)
    const [selectedStrokeWidth,setSelectedStrokeWidth]=useState(0)
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
    const [emails,setEmails]=useState([])
    const [profiles,setProfiles]=useState([])
    const [tool,setTool]=useState('pencil')
    const [action,setAction]=useState('none')
    const [selectedElement,setSelectedElement]=useState(null);
    const [selectedPosition, setSelectedPosition]=useState(null);
    const [loading, setLoading]= useState(0);
    const [downPosition,setDownPosition]=useState({x:0,y:0})
    //conflict Management"
    const [selectingIndex,setSelectingIndex]=useState(0)
    //const [eraseList,setEraseList]=useState([]);
    //toPDF//
    
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
        console.log(tool);
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
                var lines = text.split('\n');
                var maxLen=0
                for (var i = 0; i<lines.length; i++)
                {
                    maxLen=Math.max(context.measureText(lines[i]).width,maxLen)
                }
                doc.update((root)=>{
                    root.shapes[index].index=index
                    root.shapes[index].x1=x1
                    root.shapes[index].y1=y1
                    root.shapes[index].text=text
                    root.shapes[index].width=maxLen
                    root.shapes[index].height=(root.shapes[index].fontSize+root.shapes[index].fontSize/3.5)*lines.length
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
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.touches[0].clientX-canvasX*(1/scalePer)-e.touches[0].clientX*ratioX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.touches[0].clientY-canvasY*(1/scalePer)-e.touches[0].clientY*ratioY
        if(type=='mob')
        {
            if(e.touches.length>1)
            {
                return
            }
        }
        setDownPosition({x:clientX,y:clientY})  
        const id = doc.getRoot().shapes.length;
        drawAll()
        if(tool==='selection')
        {
            if(action==='selected')
            {
                if(selectedObjPosition.x1<clientX && clientX<selectedObjPosition.x2
                    && selectedObjPosition.y1<clientY && clientY<selectedObjPosition.y2)
                    {
                        setAction('reselect')
                
                        drawSelectedBox({tool:'rectangle',...selectedObjPosition},context,null,ratioScale)
              

                        return
                    }
            }
            const getElement=getElementAtPosition(clientX,clientY,doc.getRoot().shapes)
            if(getElement)
            {
                const {element,position,pencilRange}=getElement
                pencilR=pencilRange
                setSelectedPosition(position)
                if(element.tool=='pencil')
                {
                    pencilStart={x:clientX,y:clientY}


                    drawSelectedBox(element,context,pencilRange,ratioScale)
                
                    const offsetX=pencilRange.x1-element.moveXY.x+(clientX-pencilRange.x1);
                    const offsetY=pencilRange.y1-element.moveXY.y+(clientY-pencilRange.y1);;
                    setSelectedElement({...element,offsetX,offsetY})
                }

                else{

                    drawSelectedBox(element,context,pencilRange,ratioScale)

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
            else {
                setAction("selecting")
            }
    
        }
        else if(tool==='eraser')
        {
            setAction('erasing')
        }
        else{
            setAction(tool=== "text"?"writing":'drawing');
   
            const element=createElement(id,clientX,clientY,clientX,clientY,tool,strokeColor,fillColor,strokeWidth,textSize,myFont)
            setSelectingIndex(id)
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
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.touches[0].clientX-canvasX*(1/scalePer)-e.touches[0].clientX*ratioX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.touches[0].clientY-canvasY*(1/scalePer)-e.touches[0].clientY*ratioY
        doc.update((root) => {
                
                root.mouses[client.getID()].x=clientX
                root.mouses[client.getID()].y=clientY
                });
        

        if(tool === 'selection')
        {
            if(action !== 'selecting') //이전에 드래그 선택이 안됐을 때
            {
                const elements=doc.getRoot().shapes;
                const element = getElementAtPosition(clientX,clientY,elements)
                e.target.style.cursor = element ? cursorForPosition(element.position): "default"
            }
            else{ //이전에 드래그 선택이 됐을 때
                drawAll()
  
                createSelectingBox(context,downPosition.x,downPosition.y,clientX,clientY,ratioScale)

            }
        }
        if(action==='selected' || action==='reselect')
        {
            if(selectedObjPosition.x1<clientX && clientX<selectedObjPosition.x2
                && selectedObjPosition.y1<clientY && clientY<selectedObjPosition.y2)
                {
                    e.target.style.cursor='move';
                }
            if(action==='reselect')
            {
                selectedObjects.forEach((element)=>{
                    
                    if(element.tool=='pencil')
                    {
                        moveElement({...element,offsetX:downPosition.x-element.moveXY.x,offsetY:downPosition.y-element.moveXY.y},clientX,clientY,'all')
                    }
                    else{
                        moveElement({...element,offsetX:downPosition.x-element.x1,offsetY:downPosition.y-element.y1},clientX,clientY,'all')
                    }
                })
                    
                
            }
        }
        if(action==='drawing')
        { 
            const elements=doc.getRoot().shapes;
            const index=selectingIndex
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
            moveElement(selectedElement,clientX,clientY,'each')
            
            
        }
        if(action==='resizing')
        {
            const {index,tool, ...coordinates} = selectedElement;
            const {x1,y1,x2,y2} = resizeCoordinates(clientX,clientY,selectedPosition,coordinates);
            updateElement(index, x1,y1,x2,y2, tool);
            drawAll();
 
            drawSelectedBox({tool,x1,y1,x2,y2},context,null,ratioScale)
  
        }
       
        
    }
    const onmouseup=(e,type)=>
    {
        if(action=='move')
        {
            setAction('')
            return
        }
        const ratioX=((scalePer-1)/scalePer)
        const ratioY=((scalePer-1)/scalePer)
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.changedTouches[0].clientX-canvasX*(1/scalePer)-e.changedTouches[0].clientX*ratioX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.changedTouches[0].clientY-canvasY*(1/scalePer)-e.changedTouches[0].clientY*ratioY
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
            const selectedObjList=[]
            indexList.forEach((idx)=>
            {
                const element=doc.getRoot().shapes[idx]
                selectedObjList.push({...element,moveXY:{...element.moveXY}})
            })
            setSelectedObjIdx(indexList)
            setSelectedObjects(selectedObjList)
            setSelectedObjPosition({x1:minX,y1:minY,x2:maxX,y2:maxY}) 
            drawAll()
            /*const spx=Math.min(downPosition.x,clientX)
            const spy=Math.min(downPosition.y,clientY)
            const epx=Math.max(downPosition.x,clientX)
            const epy=Math.max(downPosition.y,clientY)
            html2canvas(document.body,{x:spx,y:spy,width:epx-spx,height:epy-spy}).then(function(canvas) {
                document.body.appendChild(canvas);
            }); CAPTURE CODE*/

            drawSelectedBox({tool:'rectangle',x1:minX,y1:minY,x2:maxX,y2:maxY},context,null,ratioScale)

            setAction('selected')
            return
        }
        if(action==='reselect')
        {
            const selectedObjList=[]
            selectedObjIdx.forEach((idx)=>
            {
                const element=doc.getRoot().shapes[idx]
                selectedObjList.push({...element,moveXY:{...element.moveXY}})

            })
            setSelectedObjects(selectedObjList)
            const diffX=downPosition.x-clientX
            const diffY=downPosition.y-clientY
            setSelectedObjPosition({x1:selectedObjPosition.x1-diffX,y1:selectedObjPosition.y1-diffY,x2:selectedObjPosition.x2-diffX,y2:selectedObjPosition.y2-diffY}) 
            setAction('selected')
            return
        }
        if(action === 'drawing' && (tool==='rectangle' || tool === 'line')){
            const index = doc.getRoot().shapes.length-1
            const {x1,y1,x2,y2}=adjustElementCoordinates(doc.getRoot().shapes[index]);
            updateElement(index, x1,y1,x2,y2,tool)
            setTool('selection')
            setToolUp(0)
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
        if(doc==null) 
        {
            return
        }
        const root = doc.getRoot();
        if(root.shapes===undefined) 
        {
            return
        }
        
        context.clearRect(0,0,canvas.width,canvas.height);
        
        /*var img = new Image();
        img.src = 'https://placeimg.com/100/100/any';
        img.onload = function(){
        context.drawImage(img, 10, 10);
        }*/
        context.scale(_ratioScale,_ratioScale)
        root.shapes.forEach(element => drawElement(context, element, canvasX,canvasY,scalePer));
        context.scale(1/_ratioScale,1/_ratioScale)
        setMouses(doc.getRoot().mouses)
    }
    //api call//
    //Yorkie//
    async function activateClient()
    {
            setLoading(1)
            client = new yorkie.Client(`https://api.fillkie.com`,{presence: {
                username: user_email,
                image: user_profile,
              }})
            await client.activate();   
            doc = new yorkie.Document(docKey);   
            await client.attach(doc);
            doc.update((root) => {
                if(root.shapes)
                {
                    return
                }
                root.shapes=[]
                });
            subscribeDoc();   
            drawAll()          
    }


    function subscribeDoc()
    {
        
        doc.subscribe((event) => {
            if (event.type === 'remote-change') {
                setNewPage(doc.getRoot().pages)
                
                drawAll()
            }
            });

        client.subscribe((event) => {
            if (event.type === 'peers-changed') {
                doc.update((root) => {
                    if(!root.shapes)
                    {
                        root.shapes=[]
                    }
                    if(!root.mouses)
                    {
                        root.mouses={}
                    }    
                    if(!root.users)
                    {
                        root.users=[]
                    }    
                    if(!root.pages)
                    {
                        root.pages=0
                    }
                    
                    });
                
                setUsers(Object.keys(event.value[`${docKey}`]))
                Object.keys(event.value[`${docKey}`]).forEach((user)=>{
                    doc.update((root) => {
                        root.mouses[user]={'x':0,'y':0}
                        });
                })
                setEmails([])
                setProfiles([])
                for (const [clientID, presence] of Object.entries(event.value[`${docKey}`])) {
                    setEmails((before)=>[...before,presence.username])
                    setProfiles((before)=>[...before,presence.image])
                  }
                setMouses(doc.getRoot().mouses)
                console.log('changed!')
                setLoading(0)
            } else if (event.type === 'stream-connection-status-changed') {
                
            }
            });
            
        
    }
    useLayoutEffect(()=>
    {
        client=null
        document.body.style.overflow = "hidden";
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        })
    },[])
    useEffect(()=> {
        
        //프로필 불러오기//
        springAxios.get('/user/profile').then((response)=>{dispatch(setUserInfo(response.data.data.userName,response.data.data.userImage))}).catch(()=>{dispatch(setUserInfo('test@email.com','https://picsum.photos/200'))})
        //폰트 불러오기//
        myFont = new FontFace('myFont', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Manse.woff)');
        myFont.load().then(function(font){
        document.fonts.add(font);
        });
        //캔버스 사이즈//
        canvas=document.getElementById('canvas');
        context=canvas.getContext('2d');
        window.addEventListener("wheel",function(e){e.preventDefault()},{passive: false})
        //클라이언트 활성화//
        if(client===null && user_email!=='asd')
        {
           activateClient();   
        }
    },[user_email]
    )

    useEffect(()=>
    {
        if(action==='writing')
        {
            setTimeout(()=>{textRef.current.focus()},1)
        }
    },[action,selectedElement])
    useEffect(()=>
    {
        _ratioScale=ratioScale
        drawAll();
    },[ratioScale,pageNum])
    useEffect(()=>
    {
        console.log(saveCanvasX,saveCanvasY)
        setCanvasX(saveCanvasX)
        setCanvasY(saveCanvasY)
        drawAll();
    },[newPage])
    //textarea resize//

    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = textRef.current.scrollHeight + "px";
        textRef.current.style.width = textRef.current.scrollWidth + "px";
  }, []);
    var onScroll = function(callback) {
        if (handle) {
            clearTimeout(handle);
        }
        
        handle = setTimeout(callback, 200); // default 200 ms
    };

    return(
        <div className='bg'>
            {loading?<div style={{position:'absolute'}}><Loading></Loading></div>:null}
            
            <div 
            
            id="frame" style={{position:'absolute',transform:'translateY(0px)',overflow:'hidden', backgroundColor:'lightgray',width:`${window.innerWidth}px`, height:`${window.innerHeight}px`}}>
                <QuickPinchZoom
                maxZoom={3}
                tapZoomFactor={0}
                zoomOutFactor={0}
                minZoom={0.1}
                verticalPadding={1000000}
                onUpdate={({scale,x,y})=>{
                    onScroll(()=>{setRatioScale(window.devicePixelRatio*scale);
                        })
                    setCanvasX(x*scale)
                    setCanvasY(y*scale)
                    setScalePer(scale)
                    }}
                    >
                
                <div 
                ref={canvasRef} id="test" style={{
                        width:`${1000*(595.28/841.89)}px`,
                        height:`${1000*(pageNum+newPage)}px`,
                        zIndex:'1',
                        transformOrigin: 'top left',
                        transform: `translate(${canvasX}px,${canvasY}px) scale(${scalePer})`,
                }}>
                   
                <button 
                className="addPageButton"
                onClick={()=>{
                    saveCanvasX=canvasX
                    saveCanvasY=canvasY
                    setNewPage(newPage+1);
                    doc.update((root) => {
                        root.pages=root.pages+1
                        });}} 
                style={{width:`${1000*(595.28/841.89)}px`, position:'absolute',zIndex:'6',transform:`translateY(${1000*(pageNum+newPage)+10}px)`}}>+</button>
                
                        <canvas
                        style={{
                            position:'absolute',
                            zIndex:'5',
                            width:`${1000*(595.28/841.89)}px`,
                            height:`${1000*(pageNum+newPage)}px`,
                            display:`${loading?'none':'block'}`,
                          
                            }}
                        id="canvas"
                        width={1000*(595.28/841.89)*ratioScale}
                        height={(1000*(pageNum+newPage))*ratioScale}
                        onMouseDown={(e)=>{onmousedown(e,'des')}}        
                        onMouseMove={(e)=>{onmousemove(e,'des')}}
                        onMouseUp={(e)=>{onmouseup(e,'des')}}
                        onTouchStart={(e)=>{onmousedown(e,'mob')}}
                        onTouchMove={(e)=>{onmousemove(e,'mob')}}
                        onTouchEnd={(e)=>{onmouseup(e,'mob')}} >  
                        </canvas>   
                      
        

                <MyDocument pdf={myPdf} pageNums={newPage}></MyDocument>
                {
                    action === "writing"?
                    <textarea
                        data-html2canvas-ignore="true" 
                        onInput={handleResizeHeight}
                        onChange={(e)=>{const {index, x1,y1,tool} = selectedElement; updateElement(index,x1,y1,null,null,tool,e.target.value)}}
                        onBlur={(e)=>{onblur(e)}}
                        style={{
                            position:'fixed', 
                            top:selectedElement.y1-selectedElement.fontSize/7,
                            left:selectedElement.x1,
                            font: `${textSize}px myFont`,
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
                
                
                 <div data-html2canvas-ignore="true" style={{zIndex:'10',position:'relative'}} >
                        {users.map((user,idx,key)=>{
                            if(user==client.getID()) {return}
                            return(<div style={{
                                
                                position:'absolute',
                                transformOrigin: 'left' | 'top',
                                transform: `translate(${mouses[user].x}px,${mouses[user].y}px)`,
                                transition: 'all ease 0.1s'
                            }}>
                                <img  width={20} height={20} src={require('./Icons/multi-mouse.png')}></img>
                                <img style={{borderRadius:'100px',position:'relative', top:'15px',right:'15px',}} width={20} height={20} src={profiles[idx]}></img>
                            </div>)})}
                </div> 
                
                </div>
             
                </QuickPinchZoom>
            </div>
            
             
            <div className="participants"
            style={{transform: resp?'translateY(calc(100vh - 100% - 20px))':'none'}}
            >
                <div className="participants-desc">사용자</div>    
                {emails.map((user,idx,key)=>{return(
                <div className="participants-box">
                     <img className="participants-box-img" src={profiles[idx]}>
                    </img>
                    <div className="participants-box-desc">
                        {user}
                    </div>
                </div>)})}
            </div>
            
            <div className="toolBox">
                <button className={tool==='selection'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('selection');setToolUp(0)}}>
                <img className={tool==='selection'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-select.png")}></img>
                </button>
                <div>
                    <button className={tool==='pencil'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('pencil');setToolUp(0);if(tool==='pencil')toolUp==1?setToolUp(0):setToolUp(1)}}>
                        <img className={tool==='pencil'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-draw.png")}></img>
                    </button>
                    {toolUp==1?<PencilTool 
                    selectedStrokeWidth={selectedStrokeWidth}
                    setStrokeWidth={setStrokeWidth}
                    setSelectedStrokeWidth={setSelectedStrokeWidth}
                    strokePicker={strokePicker}
                    setStrokePicker={setStrokePicker}
                    strokeColor={strokeColor}
                    setStrokeColor={setStrokeColor}></PencilTool>:null}
                </div>
                <div>
                    <button className={tool==='line' || tool==='rectangle'?"toolBox-button-active":"toolBox-button"} onClick={()=>{selectedShape===0?setTool('line'):setTool('rectangle');setToolUp(0);if(tool==='line' || tool==='rectangle')toolUp==2?setToolUp(0):setToolUp(2)}}>
                        <img className={tool==='line' || tool==='rectangle'? "toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-shape.png")}></img>      
                    </button>
                    {toolUp==2?<ShapeTool 
                    selectedStrokeWidth={selectedStrokeWidth}
                    setStrokeWidth={setStrokeWidth}
                    setSelectedStrokeWidth={setSelectedStrokeWidth}
                    strokePicker={strokePicker}
                    setStrokePicker={setStrokePicker}
                    strokeColor={strokeColor}
                    setStrokeColor={setStrokeColor}
                    selectedShape={selectedShape}
                    setSelectedShape={setSelectedShape}
                    setTool={setTool}
                    tool={tool}
                    fillPicker={fillPicker}
                    setFillColor={setFillColor}
                    setFillPicker={setFillPicker}
                    fillColor={fillColor}

                    ></ShapeTool>:null}
                </div>
                <button className={tool==='eraser'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('eraser');setToolUp(0)}}>
                <img className={tool==='eraser'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-eraser.png")}></img>
                </button>
                <div>

                    <button className={tool==='text'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('text');setToolUp(0);if(tool==='text')toolUp==3?setToolUp(0):setToolUp(3)}}>
                        <img className={tool==='text'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-text.png")}></img>
                    </button>
                    {toolUp==3?<TextTool
                    selectedTextSize={selectedTextSize}
                    setSelectedTextSize={setSelectedTextSize}
                    setTextSize={setTextSize}
                    fillColor={fillColor}
                    setFillColor={setFillColor}
                    setFillPicker={setFillPicker}
                    fillPicker={fillPicker}
                    ></TextTool>:null}
                </div>
                <button className="toolBox-button" onClick={()=>{doc.update((root)=>root.shapes=[]);drawAll();setToolUp(0)}} >
                <img className="toolBox-icon" src={require("./Icons/tool-recycle.png")}></img>
                </button>
                <button className="toolBox-button" onClick={()=>{toPdf(document.getElementById('test'));;setToolUp(0)}}>
                <img className="toolBox-icon" src={require("./Icons/tool-download.png")}></img>
                </button>
                

             
               

            </div>
            
           
        </div>
    )
}
export default Editor