
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import pdf from './test.pdf'
import {useSelector,useDispatch} from 'react-redux'
import {setPdfPages} from '../../reducer/pdf_reducer'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const MyDocument=({pageNums})=> {
  const [numPages, setNumPages] = useState([]);
  const [newPages, setNewPages]=useState([])
  const [pageNumber, setPageNumber] = useState(1);
  const [creatingPage, setCreatingPage]=useState(0)
  const dispatch=useDispatch()
  const pages=useSelector(state=>state.pdf_reducer.pages)
  useEffect(()=>
  {
    var tempList=[]
    for(var i=0;i<pageNums;i++)
    {
      
      tempList.push(pageNums)
    }
    setNewPages(tempList)
    console.log(tempList)
  },[pageNums])

  function onDocumentLoadSuccess(params) {
    console.log(params)
    var tempList=[]
    dispatch(setPdfPages(params.numPages))
    for(var i=1;i<=params.numPages;i++)
    {
        tempList.push(i)
    }
    setNumPages(tempList);
  }
  

  return (
    <div style={{ position:'fixed',left:'0px',top:'0px',zIndex:'0',transform:'scale(1)'}}>
        <Document pageLayout='oneColumn' file={pdf}  onLoadSuccess={onDocumentLoadSuccess}>
        {
            numPages.map((pageNumber)=>{return(
                <div>
                    <Page wrap={false} height={1000} pageNumber={pageNumber} />
                    <div data-html2canvas-ignore="true" style={{height:1, backgroundColor:'gray'}}></div>
                </div>
            )})
        }
        </Document>
        {newPages.map((pageNumber)=>{return(
          <div>
            <div style={{height:'1000px',width:1000*(595.28/841.89),backgroundColor:'white'}}></div>
            <div data-html2canvas-ignore="true" style={{height:1, backgroundColor:'gray'}}></div>
          </div>
        )})}

       


    </div>
  );
}
export default MyDocument