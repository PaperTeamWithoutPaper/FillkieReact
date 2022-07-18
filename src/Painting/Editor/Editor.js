import {useRef,useState,useEffect} from 'react'
import Canvas from './Canvas'
import DrawingBoard from './DrawingBoard/DrawingBoard'
import yorkie from 'yorkie-js-sdk'
const Editor=()=>
{
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
        const client=new yorkie.Client('https://api.fillkie.com:8080/',options)
        await client.activate();
        console.log(editor,client)
        const doc=new yorkie.Document('docs','doc1')
        await client.attach(doc);
        doc.update((root)=>{
            if(!root.content){
                root.content= new yorkie.Text();
            }
        })
        editor.on('beforeChange', (cm, change)=>{console.log(change)})
        doc.getRoot().content.onChanges((changes)=>{console.log(changes)})
    }
    useEffect(()=>{main()},[])
    return(
        <div>
            {/*<div style={{width:'100vw'}} ref={divRef}>
            <DrawingBoard width={width} height={height}>
            </DrawingBoard>
            </div> */}
            <textarea id="ta" style={{width:'100vw',height:'100vh'}}></textarea>

            
        </div>
    )
}
export default Editor