import jsPDF from "jspdf";
export const toPdf=(canvas)=>
{
    var imgData = canvas.toDataURL("image/jpeg");
    var pdf = new jsPDF();
  
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("download.pdf");

}