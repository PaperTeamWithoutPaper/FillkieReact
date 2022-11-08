
import { useEffect, useLayoutEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { pdfjs } from 'react-pdf';
import testPdf from './test.pdf'
import {useSelector,useDispatch} from 'react-redux'
import pdfjsWorker from 'react-pdf/src/pdf.worker.entry.js'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import {setPdfPages} from '../../reducer/pdf_reducer'

const MyDocument=({pdf, pageNums})=> {
  const [numPages, setNumPages] = useState([]);
  const [newPages, setNewPages]=useState([])
  const [pageNumber, setPageNumber] = useState(1);
  const [creatingPage, setCreatingPage]=useState(0);
  const [myPdf,setMyPdf]=useState()
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
  useLayoutEffect(()=>{
  
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    if(pdf=='none' || pdf==null)
    {
      setMyPdf(testPdf)
    }
    else{
      setMyPdf(pdf)
    }
  })

  return (
    <div style={{ position:'fixed',left:'0px',top:'0px',zIndex:'0',transform:'scale(1)'}}>
        <Document file={myPdf}  onLoadSuccess={onDocumentLoadSuccess}>
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