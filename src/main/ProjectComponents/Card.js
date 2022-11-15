import { useState, useRef } from "react"
import useDrag from "./useDrag";
import {useDispatch,useSelector} from 'react-redux';
import { IsCreateProject } from "../../reducer/project_reducer";
import { useNavigate } from "react-router";
import { nodeAxios } from "../../apis/api";
import { setFileInfo,fileLoading, setCurDir, setDragFrom } from "../../reducer/file_reducer";
import '../../Editor/Loading'
const Card=(props)=>
{
    const [ishover,setIshover]=useState(0)
    const [isover,setIsover]=useState(0)
    const [myImage,setMyImage]=useState('')
    const dragFromId=useSelector(state=>state.file_reducer.dragFromId)
    const ondragover=()=>
    {
        setIsover(1)
    }
    const ondragleave=()=>
    {
        setIsover(0)
    }
    ///////// folder click //////////
    const readFile=()=>
    {
        dispatch(setCurDir(props.id))
        dispatch(fileLoading(1))
        nodeAxios.get(`/dir?projectId=${props.pid}&folderId=${props.id}`).then((response)=>{dispatch(setFileInfo(props.id,response.data.data));dispatch(fileLoading(0))})
    }
    const ondrop=()=>
    {
        console.log(dragFromId)
        setIsover(0)
    }
    const ondragstart=()=>
    {
        dispatch(setDragFrom(props.id))
    }
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const getIcon=()=>
    {
        if(props.type==1)
        {
            if(props.name.slice(-8)=='.fillkie' || props.name.slice(-4)=='.pdf')
                return '📝'
            if(props.name.slice(-4)=='.png' || props.name.slice(-4)=='.jpg')
                return '🏞'
        }
        if(props.type==2)
            return '📁'
        if(props.type==3)
            return '➕'
        if(props.type==4)
            return '🗂'
        return '💾'
        
    }
    return(
        <div 
            draggable={props.type!=3?'true':'false'}
            onDragStart={props.type!=3?ondragstart:null}
            onDragOver={props.type==2?ondragover: null}
            onDragLeave={props.type==2?ondragleave:null}
            onDrop={props.type==2?ondrop:null}
            className={"Card-body"}
            onMouseOver={()=>{setIshover(1)}} 
            onMouseOut={()=>{setIshover(0)}}
            onClick={()=>{if(props.type==3){dispatch(IsCreateProject(1))}
            if(props.type==2){readFile()}
            if(props.type==4){navigate(`/board/${props.id}/${props.pid}`)}
            if(props.type==1){
                if(getIcon()=='📝')
                {
                    if(props.name.slice(-4)=='.pdf')
                    {
                        setMyImage('asd')
                        nodeAxios.get(`/file?projectId=${props.pid}&fileId=${props.id}`,{responseType: 'blob'}).then((response)=>{
                        
                        let url = window.URL || window.webkitURL;
                        let imgsrc = url.createObjectURL(response.data); 
                        navigate(`/meeting/${props.id}`,{
                            state: {
                              pdf: imgsrc
                            }
                    
                          })
                        setMyImage()
                    })}
                    else{
                    navigate(`/meeting/${props.id}`,{
                        state: {
                          pdf: 'none'
                        }
                    
                      })
                    }
                    
                }
                else{
                    setMyImage('none')
                    nodeAxios.get(`/file?projectId=${props.pid}&fileId=${props.id}`,{responseType: 'blob'}).then((response)=>{
                    
                    let url = window.URL || window.webkitURL;
                    let imgsrc = url.createObjectURL(response.data);
                    
                    window.open(imgsrc);
                    setMyImage()

                })
            }
                
                
                //
            }
        }
            
        }
            onContextMenu={(e)=>{
                e.preventDefault();
                console.log('a')}}>

                <div className="Card-icon">{getIcon()}</div>
                <div className="Card-shadow-hidden"></div>
             
                {myImage && <div className="lds-dual-ringc"></div>}
                <div className={ishover?"Card-title-active":"Card-title"}>{props.title.length>30?props.title.slice(0,30)+'...':props.title}</div>
                
            
        
        </div>
    )
}
export default Card