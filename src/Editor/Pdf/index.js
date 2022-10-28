
import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import pdf from './test.pdf'
import {useSelector,useDispatch} from 'react-redux'
import {setPdfPages} from '../../reducer/pdf_reducer'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const MyDocument=(props)=> {
  const [numPages, setNumPages] = useState([]);
  const [newPages, setNewPages]=useState([])
  const [pageNumber, setPageNumber] = useState(1);
  const [creatingPage, setCreatingPage]=useState(0)
  const dispatch=useDispatch()
  const pages=useSelector(state=>state.pdf_reducer.pages)
  function onDocumentLoadSuccess(params) {
    
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
                    <Page wrap={false} size="A4" height={1000} pageNumber={pageNumber} />
                    <div style={{height:1, backgroundColor:'gray'}}></div>
                </div>
            )})
        }
        </Document>

       


    </div>
  );
}
export default MyDocument