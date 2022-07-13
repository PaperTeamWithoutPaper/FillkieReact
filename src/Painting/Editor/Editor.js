import {useRef,useState,useEffect} from 'react'
import Canvas from './Canvas'
import DrawingBoard from './DrawingBoard/DrawingBoard'
const Editor=()=>
{
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const divRef = useRef(null);
    useEffect(() => {
        setWidth(window.screen.width);
        setHeight(window.screen.height);
      }, []);
    return(
        <div>
            <div style={{width:'100vw'}} ref={divRef}>
            <DrawingBoard width={width} height={height}>
            </DrawingBoard>
            </div>
        </div>
    )
}
export default Editor