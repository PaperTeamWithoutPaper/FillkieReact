import {useRef,useState,useEffect} from 'react'
const Canvas=()=>
{
    const canvasRef=useRef();
    const contextRef=useRef();
    const [isDrawing,setIsDrawing]=useState(false)
    const [ctx,setCtx]=useState()
    
    useEffect(()=>
    {
        
        const canvas=canvasRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        const context=canvas.getContext("2d");
        context.strokeStyle="black";
        context.lineWidth=2.5;
        contextRef.current=context;
        setCtx(context)
    },[])
    const startDrawing=(e)=>
    {
        e.persist();
        
        setIsDrawing(true);
    }
    const finishDrawing=(e)=>
    {
        e.persist();
        setIsDrawing(false);
    }
    const drawing=({nativeEvent})=>
    {
        const{offsetX,offsetY}=nativeEvent;
        if(ctx)
        {
            if(!isDrawing)
            {
                ctx.beginPath();
                ctx.moveTo(offsetX,offsetY)
            }
            else{
                ctx.lineTo(offsetX,offsetY);
                ctx.stroke();
            }
        }
    }
    return(
        <div style={{position:'absolute'}}>
            <div style={{position:'absolute', zIndex:'123'}}></div>
            <canvas
            style={{backgroundColor:'gray',
                    width:'100vw', height:'100vh',
                    position:'absolute'}}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={drawing}
            onMouseLeave={finishDrawing}
            >
            </canvas>
        </div>
    )
}
export default Canvas