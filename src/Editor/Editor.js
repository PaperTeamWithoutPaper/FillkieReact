import ToolBar from "./ToolBar"
import DrawingBoard from "./DrawingBoard"
import {useEffect,useState,useRef} from 'react'
const Editor=()=>
{
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const divRef = useRef();
    useEffect(() => {
        const onResize = () => {
          if (!divRef.current) {
            return;
          }
          const rect = divRef.current.getBoundingClientRect();
          setWidth(window.innerWidth);
          setHeight(window.innerHeight-45);
        };
    
        onResize();
        window.addEventListener('resize', onResize);
        return () => {
          window.removeEventListener('resize', onResize);
        };
      }, []);
    return(
        <div ref={divRef}>
            <ToolBar></ToolBar>
            <DrawingBoard width={width} height={height}/>
        </div>
    )
}
export default Editor