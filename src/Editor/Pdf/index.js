
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import pdf from './test.pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const MyDocument=(props)=> {
  const [numPages, setNumPages] = useState([]);
  const [newPages, setNewPages]=useState([])
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(params) {
    
    var tempList=[]
    for(var i=1;i<=params.numPages;i++)
    {
        tempList.push(i)
    }
    
    setNumPages(tempList);
  }
  useEffect(()=>{
    var pageList=[]
    for(var i=1;i<=props.pageNum-numPages.length;i++)
    {
        pageList.push(i)
    }
      setNewPages(pageList);
  }
  )
  
  


  return (
    <div style={{ position:'fixed',left:'0px',top:'0px',zIndex:'0',transform:'scale(1)'}}>
        <Document pageLayout='oneColumn' file={pdf}  onLoadSuccess={onDocumentLoadSuccess}>
        {
            numPages.map((pageNumber)=>{return(
                <div>
                    <Page wrap={false} size="A4" height={window.innerHeight} pageNumber={pageNumber} />
                    <div style={{height:1, backgroundColor:'gray'}}></div>
                </div>
            )})
        }
        </Document>
        {newPages.map((pageNumber)=>{return( 
            <div>
        <div style={{backgroundColor:'white', width:`${window.innerHeight*(21.59/28.25)}px`, height:`${window.innerHeight}px`}}>
        </div>
        <div style={{height:1, backgroundColor:'gray'}}></div>
        </div>)})}
       


    </div>
  );
}
export default MyDocument