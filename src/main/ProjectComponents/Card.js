import { useState, useRef } from "react"
import useDrag from "./useDrag";
const Card=(props)=>
{
    const [ishover,setIshover]=useState(0)
    const divRef = useRef();

    const [translate, setTranslate] = useState({ x: 0, y: 0 ,zindex:10 });

    const handleDrag = (e) => {
        setTranslate({
        x: translate.x + e.movementX,
        y: translate.y + e.movementY,
        zindex: translate.zindex
        });
    };
    const handlePointerDown = (e) => {
        setTranslate({
        x: translate.x + e.movementX,
        y: translate.y + e.movementY,
        zindex: translate.zindex+1
        });
    };
    const drag = useDrag(divRef, [translate], {
        onDrag: handleDrag,
        onPointerDown: handlePointerDown
    });

    return(
        <div 
            ref={divRef} 
            style={{position: 'relative', zIndex: `${translate.zindex}`, transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}
            className="Card-body" 
            onMouseOver={()=>{setIshover(1)}} 
            onMouseOut={()=>{setIshover(0)}}>
            <div className="Card-title">{props.type?'📝':'📁'} {props.title}</div>
            <div className={ishover?"Card-shadow-active":"Card-shadow-hidden"}></div>
            <div className={ishover?"Card-desc-active":"Card-desc-hidden"}>{props.desc}</div>
        </div>
    )
}
export default Card