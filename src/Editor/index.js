import {useEffect, useLayoutEffect,useState,useRef,useCallback} from 'react'
import {getMinMaxXY,getElementsAtPosition, drawSelectedBox, drawElement,createSelectingBox,createElement,getElementAtPosition,adjustElementCoordinates,cursorForPosition,resizeCoordinates} from './util'
import yorkie from 'yorkie-js-sdk'
import { useParams } from 'react-router'
import "./Editor.scss"
import { SketchPicker } from 'react-color'
import html2canvas from 'html2canvas'
import {toPdf} from './toPdf'
import MyDocument from './Pdf'
import Loading from '../Loading/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import { setUserInfo } from '../reducer/user_reducer'
import { springAxios } from '../apis/api'
import { useLocation } from 'react-router-dom';
import {listenWindowResize} from 'react-size'
var client=null;
var doc= null;
var canvas= null;
var context=null;
var pencilR=null;
var pencilStart=null;
var myFont=null;
const Editor=()=>
{
    //move//
    const [isMove,setIsMove]=useState(-1)
    //navigate//
    const location = useLocation();
    const myPdf=location.state.pdf;
    console.log(myPdf)
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
        
        if(element.tool==='line' || element.tool === "rectangle")
            {
                const {index,x1,x2,y1,y2,tool,offsetX,offsetY} = element
                const width=x2-x1;
                const height=y2-y1;
                const newX=clientX-offsetX
                const newY=clientY-offsetY
                
                updateElement(index,newX,newY,newX+width,newY+height,tool);
                drawAll();
                if(flag=='each')
                {
                    context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                    drawSelectedBox({tool,x1:newX,y1:newY,x2:newX+width,y2:newY+height},context)
                    context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
                }
                
            }
            else if(element.tool==='text')
            {
                const {index,x1,y1,tool,text} = element
                
                updateElement(index,x1+clientX-pencilStart.x,y1+clientY-pencilStart.y,null,null,tool,text);
                drawAll();
                if(flag=='each')
                {
                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                drawSelectedBox({tool,x1:x1+clientX-pencilStart.x,y1:y1+clientY-pencilStart.y,x2:null,y2:null,width:element.width},context)
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
                }

            }
            else if(element.tool==='pencil')
            {
                
                const {index,tool,offsetX,offsetY} = element
                const shape=doc.getRoot().shapes[index]
                
                movePencil(index,tool,clientX-offsetX,clientY-offsetY)
                drawAll();

                if(flag=='each')
                {
                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                drawSelectedBox(element,context,{
                    x1:pencilR.x1+clientX-pencilStart.x,
                    y1:pencilR.y1+clientY-pencilStart.y,
                    x2:pencilR.x2+clientX-pencilStart.x,
                    y2:pencilR.y2+clientY-pencilStart.y})
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
                }

            }
            if(flag=='all')
        {
            const diffX=downPosition.x-clientX
            const diffY=downPosition.y-clientY
            context.scale(window.devicePixelRatio,window.devicePixelRatio)   
            drawSelectedBox({tool:'rectangle',x1:selectedObjPosition.x1-diffX,y1:selectedObjPosition.y1-diffY,x2:selectedObjPosition.x2-diffX,y2:selectedObjPosition.y2-diffY},context)
            context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
        }
    }
    //canvas pages//
    const pageNum=useSelector(state=>state.pdf_reducer.pages)
    const [newPage,setNewPage]=useState(0)
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
        if(isMove==1) 
        {
            setAction('move')
            return
        }
        if(textRef.current) return
        const ratioX=((scalePer-1)/scalePer)
        const ratioY=((scalePer-1)/scalePer)
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.touches[0].clientX-canvasX*(1/scalePer)-e.touches[0].clientX*ratioX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.touches[0].clientY-canvasY*(1/scalePer)-e.touches[0].clientY*ratioY

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
                        context.scale(window.devicePixelRatio,window.devicePixelRatio)   
                        drawSelectedBox({tool:'rectangle',...selectedObjPosition},context)
                        context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
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
        if(action=='move')
        {
            cx-=e.movementX
            cy-=e.movementY

            setCanvasY(cy)
            setCanvasX(cx)
            return
        }
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
                context.scale(window.devicePixelRatio,window.devicePixelRatio)    
                createSelectingBox(context,downPosition.x,downPosition.y,clientX,clientY)
                context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
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
                    moveElement({...element,offsetX:downPosition.x-element.x1,offsetY:downPosition.y-element.y1},clientX,clientY,'all')})
                
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
            context.scale(window.devicePixelRatio,window.devicePixelRatio)    
            drawSelectedBox({tool,x1,y1,x2,y2},context)
            context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
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
        var clientX=type=="des"?e.clientX-canvasX*(1/scalePer)-e.clientX*ratioX:e.touches[0].clientX-canvasX
        var clientY=type=="des"?e.clientY-canvasY*(1/scalePer)-e.clientY*ratioY:e.touches[0].clientY-canvasY
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
                selectedObjList.push({...element})
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
            context.scale(window.devicePixelRatio,window.devicePixelRatio)   
            drawSelectedBox({tool:'rectangle',x1:minX,y1:minY,x2:maxX,y2:maxY},context)
            context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
            setAction('selected')
            return
        }
        if(action==='reselect')
        {
            const selectedObjList=[]
            selectedObjIdx.forEach((idx)=>
            {
                const element=doc.getRoot().shapes[idx]
                selectedObjList.push({...element})
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
    useEffect(()=>
    {
        setScalePer(scalePer+0.00001);
    },[newPage])

    //캔버스 생성//
    function drawAll()
    {
        if(doc==null) return
        const root = doc.getRoot();
        if(root.shapes===undefined) return
        context.clearRect(0,0,canvas.width,canvas.height);
        
        /*var img = new Image();
        img.src = 'https://placeimg.com/100/100/any';
        img.onload = function(){
        context.drawImage(img, 10, 10);
        }*/
        context.scale(window.devicePixelRatio,window.devicePixelRatio)
        root.shapes.forEach(element => drawElement(context, element));
        context.scale(1/(window.devicePixelRatio),1/(window.devicePixelRatio))
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
            
            setLoading(0)
            
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
                
            } else if (event.type === 'stream-connection-status-changed') {
                
            }
            });
            
        
    }
    useLayoutEffect(()=>
    {
        client=null
        document.body.style.overflow = "hidden";
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
        const frame=document.getElementById('frame');
        frame.addEventListener("wheel", function(e){
            e.preventDefault();
            if (e.ctrlKey) {
                if(scp-e.deltaY/200>=0.2 && scp-e.deltaY/200<=5)
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
        //클라이언트 활성화//
        if(client===null && user_email!=='asd')
        {
           activateClient();   
        }
    },[user_email]
    )
    useEffect(()=>
    {
        drawAll()
    },[pageNum])
    useEffect(()=>
    {
        if(action==='writing')
        {
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
    //textarea resize//

    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);
    
    return(
        <div>
            {loading?<Loading></Loading>:null}
            {
            <div id="frame" style={{transform:'translateY(0px)',overflow:'hidden', backgroundColor:'lightgray',width:`${window.innerWidth}px`, height:`${1000}px`}}>
                <div id="test" style={{
                        width:`${1000*(595.28/841.89)}px`,
                        height:`${1000*(pageNum+newPage)}px`,
                        zIndex:'1',
                        transformOrigin: 'top left',
                        transform: `translate(${canvasX}px,${canvasY}px) scale(${scalePer})`,
                }}>
                   
                <button onClick={()=>{
                    setNewPage(newPage+1);
                    doc.update((root) => {
                        root.pages=root.pages+1
                        });}} 
                style={{width:`${1000*(595.28/841.89)}px`, position:'absolute',zIndex:'6',transform:`translateY(${1000*(pageNum+newPage)}px)`}}>Add Page</button>
                <canvas
                style={{
                    position:'absolute',
                    zIndex:'5',
                    width:`${1000*(595.28/841.89)}px`,
                    height:`${1000*(pageNum+newPage)}px`,
                    display:`${loading?'none':'block'}`,
                    }}
                id="canvas"
                width={1000*(595.28/841.89)*window.devicePixelRatio}
                height={(1000*(pageNum+newPage))*window.devicePixelRatio}
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
            </div>
            }
             
            <div className="participants">
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
                <button className={tool==='pencil'?"toolBox-button-active":"toolBox-button"} onClick={()=>{setTool('pencil')}}>
                    <img className={tool==='pencil'?"toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-draw.png")}></img>
                </button>
                <button className={tool==='line' || tool==='rectangle'?"toolBox-button-active":"toolBox-button"} onClick={()=>{selectedShape===0?setTool('line'):setTool('rectangle')}}>
                    <img className={tool==='line' || tool==='rectangle'? "toolBox-icon-active":"toolBox-icon"} src={require("./Icons/tool-shape.png")}></img>
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
                
                <button className="toolBox-button" onClick={()=>{doc.update((root)=>root.shapes=[]);drawAll()}} >
                <img className="toolBox-icon" src={require("./Icons/tool-recycle.png")}></img>
                </button>
                <button className="toolBox-button" onClick={()=>{toPdf(document.getElementById('test'))}}>
                <img className="toolBox-icon" src={require("./Icons/tool-download.png")}></img>
                </button>
                <button onClick={()=>{setIsMove(isMove*(-1))}}>test</button>


            </div>
            {/*사이드 툴바 */}
            {tool!=='selection' && tool!=='eraser'?
            <div className="toolDetail">
                {tool==='line' || tool==='rectangle'?
                <div className="toolDetail-detailBox">
                        <div className="toolDetail-detailBox-desc">도형</div>
                        <div className="toolDetail-detailBox-buttonBox">
                            <button className={selectedShape===0?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setSelectedShape(0);setTool('line')}}>
                                <div style={{width:'18px', height:'3px', backgroundColor:'black'}}></div>
                            </button>
                            <button className={selectedShape===1?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setSelectedShape(1); setTool('rectangle')}}>
                                <div style={{width:'18px', height:'18px', outline: 'solid 2px black'}}></div>
                            </button>
                            
                        </div>
                </div>:null
                }
                
                <div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">굵기</div>
                    <div className="toolDetail-detailBox-buttonBox">
                        <button className={selectedStrokeWidth===0?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(1); setSelectedStrokeWidth(0)}}>
                            <div style={{width:'18px', height:'1px', backgroundColor:'black'}}></div>
                        </button>
                        <button className={selectedStrokeWidth===1?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(3);setSelectedStrokeWidth(1)}}>
                            <div style={{width:'18px', height:'3px', backgroundColor:'black'}}></div>
                        </button>
                        <button className={selectedStrokeWidth===2?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(5);setSelectedStrokeWidth(2)}}>
                            <div style={{width:'18px', height:'5px', backgroundColor:'black'}}></div>
                        </button>
                        <button className={selectedStrokeWidth===3?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setStrokeWidth(20);setSelectedStrokeWidth(3)}}>
                            <div style={{width:'18px', height:'20px', backgroundColor:'black'}}></div>
                        </button>
                    </div>
                </div>
                {tool!=='text'?
                <div className="toolDetail-detailBox">
                    <div className="toolDetail-detailBox-desc">선 색상</div>
                        <div className="toolDetail-detailBox-buttonBox">
                            <div className="toolBox-colorBox">
                            <button onClick={()=>{setStrokePicker(1)}} style={{borderRadius: '5px', width:30,height:30,border:'1px solid lightgray',backgroundColor:`${strokeColor}`}}></button>
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
                                <button onClick={()=>{setFillPicker(1)}} style={{borderRadius: '5px', width:30,height:30,border:'1px solid lightgray',backgroundColor:`${fillColor}`}}></button>
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
                            <div style={{fontWeight:'bold'}}>S</div>
                        </button>
                        <button className={selectedTextSize===1?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(15);setSelectedTextSize(1)}}>
                            <div style={{fontWeight:'bold'}}>M</div>
                        </button>
                        <button className={selectedTextSize===2?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(20);setSelectedTextSize(2)}}>
                            <div style={{fontWeight:'bold'}}>L</div>
                        </button>
                        <button className={selectedTextSize===3?"toolDetail-detailBox-buttonBox-activeButton":"toolDetail-detailBox-buttonBox-button"} onClick={()=>{setTextSize(25);setSelectedTextSize(3)}}>
                            <div style={{fontWeight:'bold'}}>XL</div>
                        </button>
                    </div>
                        
                </div>:null}
            </div>
            :null}
         
        </div>
    )
}
export default Editor