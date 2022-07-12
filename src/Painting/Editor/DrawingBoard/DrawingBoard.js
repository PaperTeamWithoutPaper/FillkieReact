import {useRef,useState,useEffect} from 'react'
const DrawingBoard=({width,height})=>
{
    const DrawingBoardRef=useRef();
    const contextRef=useRef();
    const [isDrawing,setIsDrawing]=useState(false)
    const [ctx,setCtx]=useState()
    

    useEffect(()=>
    {
        
        const DrawingBoard=DrawingBoardRef.current;
        DrawingBoard.width='120px'
        DrawingBoard.height='120px'
        const context=DrawingBoard.getContext("2d");
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
            width={width}
            height={height}
            style={{backgroundColor:'gray',
                    position:'absolute'}}
            ref={DrawingBoardRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={drawing}
            onMouseLeave={finishDrawing}
            >
            </canvas>
        </div>
    )
}
export default DrawingBoard