import getStroke from 'perfect-freehand'
import { useState } from 'react';
//pencil
function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return ''
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
        return acc
      },
      ['M', ...stroke[0], 'Q']
    )
    d.push('Z')
    return d.join(' ')
  }

//selection
export const getElementsAtPosition=(elements,x1,y1,x2,y2)=>
{
    var returnIndex=[]
    for(var i=0;i<elements.length;i++)
    {
        const element=elements[i]
        if(element.removed==true) continue
        switch(element.tool)
        {
            case 'pencil':
                const {minX,minY,maxX,maxY}=getPencilMinMaxXY(element)
                if(minX>=x1 && maxX<=x2 && minY>=y1 && maxY<=y2) returnIndex=[...returnIndex,element.index]
                break;
            case 'line':
                
            case 'rectangle':
                if(element.x1>=x1 && element.x2<=x2 && element.y1>=y1 && element.y2<=y2) returnIndex=[...returnIndex,element.index]
                break;
            case 'text':
                if(element.x1>=x1 && element.x1+element.width<=x2 && element.y1>=y1 && element.y1+15<=y2) returnIndex=[...returnIndex,element.index]
                break;
        }
    }
    return returnIndex
}
export const getMinMaxXY=(elements,indexList)=>
{
    var maxX=0
    var minX=100101010
    var maxY=0
    var minY=111010101
    for(var i=0;i<indexList.length;i++)
    {
        const element=elements[indexList[i]]
        switch(element.tool)
        {
            case 'pencil':
                minX=minX<getPencilMinMaxXY(element).minX?minX:getPencilMinMaxXY(element).minX
                minY=minY<getPencilMinMaxXY(element).minY?minY:getPencilMinMaxXY(element).minY
                maxX=maxX>getPencilMinMaxXY(element).maxX?maxX:getPencilMinMaxXY(element).maxX
                maxY=maxY>getPencilMinMaxXY(element).maxY?maxY:getPencilMinMaxXY(element).maxY
                break;
            case 'line':
                const minX2=Math.min(element.x1,element.x2)
                const maxX2=Math.max(element.x1,element.x2)
                const minY2=Math.min(element.y1,element.y2)
                const maxY2=Math.max(element.y1,element.y2)
                minX=minX<minX2?minX:minX2
                minY=minY<minY2?minY:minY2
                maxX=maxX>maxX2?maxX:maxX2
                maxY=maxY>maxY2?maxY:maxY2
                break;

            case 'rectangle':
                minX=minX<element.x1?minX:element.x1
                minY=minY<element.y1?minY:element.y1
                maxX=maxX>element.x2?maxX:element.x2
                maxY=maxY>element.y2?maxY:element.y2
                break;
            case 'text':
                minX=minX<element.x1?minX:element.x1
                minY=minY<element.y1?minY:element.y1
                maxX=maxX>element.x1+element.width?maxX:element.x1+element.width
                maxY=maxY>element.y1+15?maxY:element.y1+15
                break;
        }
    }
    return {minX,minY,maxX,maxY}
}
export const createSelectingBox=(context,x1,y1,x2,y2)=>
{
    context.lineWidth = 1; // 선 굵기 10픽셀
    context.strokeStyle="rgb(0, 60, 255)";
    context.strokeRect(x1,y1,x2-x1,y2-y1);
    context.fillStyle="rgba(0,60,255,0.1)"
    context.fillRect(x1,y1,x2-x1,y2-y1);
}
const drawCircle=(x,y,context)=>
{
    
    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2);
    context.strokeStyle="rgb(0, 60, 255)"
    context.fillStyle="white"
    context.fill()
    context.stroke();
}
export const drawSelectedBox=(element,context,pencilRange)=>
{
    
    //draw circle//
    if(!element) return;
    const {tool,x1,y1,x2,y2}=element;
    if(tool =='rectangle')
    {  
    context.lineWidth = 1; // 선 굵기 10픽셀
    context.strokeStyle="rgb(0, 60, 255)";
    context.strokeRect(x1,y1,x2-x1,y2-y1);
    context.fillStyle="rgba(0,60,255,0.1)"
    context.fillRect(x1,y1,x2-x1,y2-y1);
    drawCircle(x1,y1,context)
    drawCircle(x2,y2,context)
    drawCircle(x1,y2,context)
    drawCircle(x2,y1,context)

    }
    if(tool==='line')
    {
        context.beginPath();
        context.moveTo(x1,y1)
        context.lineTo(x2,y2)
        context.lineWidth = 1
        context.strokeStyle = "rgb(0, 60, 255)"
        context.stroke();
        drawCircle(x1,y1,context)
        drawCircle(x2,y2,context)
    }
    if(tool==='pencil')
    {
        
        context.lineWidth = 1; // 선 굵기 10픽셀
        context.strokeStyle="rgb(0, 60, 255)";
        context.strokeRect(pencilRange.x1,pencilRange.y1,pencilRange.x2-pencilRange.x1,pencilRange.y2-pencilRange.y1);
        context.fillStyle="rgba(0,60,255,0.1)"
        context.fillRect(pencilRange.x1,pencilRange.y1,pencilRange.x2-pencilRange.x1,pencilRange.y2-pencilRange.y1);
    }
    if(tool==='text')
    {
        context.lineWidth = 1; // 선 굵기 10픽셀
        context.strokeStyle="rgb(0, 60, 255)";
        context.strokeRect(x1,y1,element.width,15);
        context.fillStyle="rgba(0,60,255,0.1)"
        context.fillRect(x1,y1,element.width,15);
    }

    
    
}
export const createElement=(index,x1,y1,x2,y2,tool,strokeColor,fillColor)=>
{
    switch (tool)
    {
        case "line":
        case 'rectangle':
        return {index,x1,y1,x2,y2,tool,removed:false,strokeColor,fillColor}
        case 'pencil':
            return {index, points: [{x:x1,y:y1}],tool,moveXY:{x:4,y:0},removed:false,fillColor}
        case 'text':
            return {index, x1,y1,tool,removed:false,text:'',width:0,height:15,fillColor}
        default:
            throw new Error(`Type not recognized: ${tool}`)

    }
}
export const drawElement=(context, element)=>
{
    const {x1,y1,x2,y2,removed}=element;
    if(removed) return;
    switch (element.tool)
    {
        
        case "line":
            context.beginPath();
            context.moveTo(x1,y1)
            context.lineTo(x2,y2)
            context.lineWidth = 2
            context.strokeStyle = element.strokeColor
            context.stroke();
            

            break;
        case 'rectangle':
            
            context.lineWidth = 2; // 선 굵기 10픽셀
            context.strokeStyle=element.strokeColor;
            context.strokeRect(x1,y1,x2-x1,y2-y1);
            context.fillStyle=element.fillColor
            context.fillRect(x1,y1,x2-x1,y2-y1);
            break;
        case 'pencil':
            context.fillStyle=element.fillColor
            var XY=[]
            for(var i=0; i<element.points.length;i++)
            {
                const tempXY={}
                tempXY.x=element.points[i].x+element.moveXY.x
                tempXY.y=element.points[i].y+element.moveXY.y
                XY.push(tempXY)
            }
            const stroke = getSvgPathFromStroke(getStroke(XY,{size:4}))
            context.fill(new Path2D(stroke))
            break;

        case 'text':
            context.textBaseline="top"
            context.fillStyle=element.fillColor
            context.font = '15px serif';
            context.fillText(element.text, element.x1, element.y1);
            break;
        default:
            throw new Error(`Type not recognized: ${element.tool}`)

    }
}
export const distance=(a,b)=>Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2))
const nearPoint = (x,y,x1,y1,name)=>
{
    return Math.abs(x-x1)<5 && Math.abs(y-y1)<5 ? name : null;
} 
const getPencilMinMaxXY=(element)=>
{
    var maxX=0
    var minX=100101010
    var maxY=0
    var minY=111010101
    for(var i=0;i<element.points.length;i++)
        {
            var cur={x:element.points[i].x+element.moveXY.x,y:element.points[i].y+element.moveXY.y}
            if(maxX<cur.x)
            {
                maxX=cur.x
            }
            if(minX>cur.x)
            {
                minX=cur.x
            }
            if(maxY<cur.y)
            {
                maxY=cur.y
            }
            if(minY>cur.y)
            {
                minY=cur.y
            }
        }
    return {minX,minY,maxX,maxY}
}
export const positionWithinElement=(x,y,element)=>
{
    const {tool,x1,x2,y1,y2,removed}=element;
    if(tool==='rectangle')
    {
        const topLeft = nearPoint(x,y,x1,y1,'tl')
        const topRight = nearPoint(x,y,x2,y1,'tr')
        const bottomLeft = nearPoint(x,y,x1,y2,'bl')
        const bottomRight = nearPoint(x,y,x2,y2,'br')
        const inside = x>=x1 && x<=x2 && y>=y1 && y<=y2 ? "inside" : null;
        return {position:topLeft || topRight || bottomLeft || bottomRight || inside}
    }else if(tool==='line'){
        const a={x:x1,y:y1}
        const b={x:x2,y:y2}
        const c={x,y}
        const offset= distance(a,b) - (distance(a,c)+distance(b,c))
        const start = nearPoint(x,y,x1,y1,'start')
        const end = nearPoint(x,y,x2,y2,'end')
        const inside = Math.abs(offset) < 1 ? "inside" : null;
        return {position:start || end || inside}
    }else if(tool === 'pencil')
    {
        var flag=false
        for(var i=0;i<element.points.length;i++)
        {
            var cur={x:element.points[i].x+element.moveXY.x,y:element.points[i].y+element.moveXY.y}
            if(distance(cur,{x,y})<10)
            {
                flag=true
            }
        }
        const {minX,minY,maxX,maxY}= getPencilMinMaxXY(element)
        const inside = flag ? "inside" : null;
        return {position:inside,pencilRange:{x1:minX,y1:minY,x2:maxX,y2:maxY}}
    }
    else if (tool==='text')
    {
        
        const inside = x1<=x && x<=x1+element.width && y1<=y&& y<=y1+15?'inside':null;
        
        return {position:inside}
        
    }
       

    
}
export const getElementAtPosition=(x,y,elements)=>
{
    for(var i=elements.length-1; i>=0;i--)
    {
        if(elements[i].removed==true) continue;
        const {position,pencilRange,removed}=positionWithinElement(x,y,elements[i])
        if(position!==null){
            return {element:elements[i],position,pencilRange}
        }
    }
    return undefined
}
export const adjustElementCoordinates=(element)=>
{
    const {tool,x1,y1,x2,y2} = element;
    
    if(tool === 'rectangle') {
        const minX=Math.min(x1,x2);
        const maxX=Math.max(x1,x2);
        const minY=Math.min(y1,y2);
        const maxY=Math.max(y1,y2);
        
        return {x1:minX,y1:minY,x2:maxX,y2:maxY}
    } else{
        if(x1<x2 || (x1===x2 && y1<y2)){
            return {x1,y1,x2,y2}
        } else{
            return {x1:x2,y1:y2,x2:x1,y2:y1};
        }
    }
}
export const cursorForPosition=(position)=>{
    switch(position)
    {
        case "tl":
        case "br":
        case "start":
        case "end":
            return "nwse-resize";
        case "tr":
        case "bl":
            return "nesw-resize";
        default:
            return "move";
    }
}
export const resizeCoordinates=(clientX,clientY,position,coordinates)=>
{
    const {x1,y1,x2,y2} = coordinates;
    switch(position){
        case "tl":
            return {x1:clientX,y1:clientY,x2,y2}
        case "tr":
            return {x1,y1:clientY,x2:clientX,y2}
        case "bl":
            return {x1:clientX,y1,x2,y2:clientY}
        case "br":
            return {x1,y1,x2:clientX,y2:clientY}
        case "start":
            return {x1:clientX,y1:clientY,x2,y2}
        case "end":
            return {x1,y1,x2:clientX,y2:clientY}
        default:
            return null;
    }
}

export const useHistory = (initialState)=>
{
    const [elements, setElements] = useState(initialState)
}