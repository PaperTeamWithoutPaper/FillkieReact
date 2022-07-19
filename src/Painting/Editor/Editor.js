import {useRef,useState,useEffect} from 'react'
import Canvas from './Canvas'
import DrawingBoard from './DrawingBoard/DrawingBoard'
import yorkie from 'yorkie-js-sdk'
var client=""
var doc=""
const Editor=()=>
{
    const [val,setVal]=useState("dump")
    /*
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const divRef = useRef(null);
    useEffect(() => {
        setWidth(window.screen.width);
        setHeight(window.screen.height);
      }, []);
      */
    
   
    async function main(){
        const editor= document.getElementById('ta')
        const options = {
            apiKey: '',
          };
        client=new yorkie.Client('http://3.39.108.134:8080')
        await client.activate();
        doc=new yorkie.Document('document')
        await client.attach(doc);
        
        doc.subscribe((event) => {
            if (event.type === "remote-change") {
                setVal(doc.getRoot().obj)
            }
          });
        client.subscribe((event) => {
        if (event.type === "peers-changed") {
            const peers = event.value[doc.getKey()];
            const peersCount = Object.entries(peers).length;
            console.log(`There are currently ${peersCount} peers`);
        }
        });
    }
    useEffect(()=>{main()},[])
    useEffect(()=>{
        if(doc==="") return;
        doc.update((root) => {
            root.obj=val
          });
    },[val])
    return(
        <div>
            {/*<div style={{width:'100vw'}} ref={divRef}>
            <DrawingBoard width={width} height={height}>
            </DrawingBoard>
            </div> */}
            <textarea onChange={(e)=>{setVal(e.target.value)}} value={val} id="ta" style={{width:'100vw',height:'100vh'}}></textarea>

            
        </div>
    )
}
export default Editor