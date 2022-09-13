
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import pdf from './test.pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const MyDocument=()=> {
  const [numPages, setNumPages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(params) {
    var tempList=[]
    console.log(params.getPage(1).width)
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
                <Page wrap={false} size="A4" height={window.innerHeight} pageNumber={pageNumber} />
            )})
        }
        </Document>

    </div>
  );
}
export default MyDocument