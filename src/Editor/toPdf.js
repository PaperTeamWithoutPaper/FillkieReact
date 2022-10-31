import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export const toPdf= async (object)=>
{
    //1.html을 들고와서 cv화

    const cv = await html2canvas(object);
    
    //2.이미지화
    const imageFile = cv.toDataURL('image/png');
    //3.pdf준비
    const doc = new jsPDF('p','mm',[595.28, 841.89]);
    //pdf 가로 세로 사이즈
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    //이미지의 길이와 pdf의 가로길이가 다르므로 이미지 길이를 기준으로 비율을 구함
    const widthRatio = pageWidth / cv.width;
    //비율에 따른 이미지 높이
    const customHeight = cv.height * widthRatio;
    //pdf에 1장에 대한 이미지 추가
    doc.addImage(imageFile, 'png', 0, 0, pageWidth, customHeight);
    //doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    //감소하면서 남은 길이 변수
    let heightLeft = customHeight;
    //증가하면서 이미지 자를 위치 변수
    let heightAdd = -pageHeight;

    // 한 페이지 이상일 경우
    while (heightLeft >= pageHeight) {
        //pdf페이지 추가
        doc.addPage();
        //남은 이미지를 추가
        doc.addImage(imageFile, 'png', 0, heightAdd, pageWidth, customHeight);
        //남은길이
        heightLeft -= pageHeight;
        //남은높이
        heightAdd -= pageHeight;
    }
    //문서저장
    doc.save('filename' + new Date().getTime() + '.pdf');
};

