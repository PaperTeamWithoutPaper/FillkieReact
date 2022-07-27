import './CreateFileModal.scss';
import {useCallback,useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IsCreateFile} from '../../reducer/file_reducer';
import { useParams } from 'react-router';
import { getCookie } from '../../cookie';
import { setDirInfo,setFileInfo } from '../../reducer/file_reducer';
const CreateFileModal=({type})=>
{
    const {id,pid}=useParams()
    const createFile=()=>
    {
        fetch(`https://api.fillkie.com/${type?'dir':'file'}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${getCookie('access')}`,
            },
            body:JSON.stringify({
                projectId:id,
                folderId:pid,
                name:fileName
            })
            }).then((response)=>
            {
                response.json().then((d)=>{
                    fetch(`https://api.fillkie.com/dir?projectId=${id}&folderId=${pid}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${getCookie('access')}`,
                        },
                        }).then((response)=>
                        {
                            response.json().then((d)=>{
                                dispatch(setFileInfo(d.data))    
                                setLoading(0);setTimeout(()=>removeComponent(),300)      
                            })})
                })})
    }
    const removeComponent=()=>
    {
        dispatch(IsCreateFile(0))
    }
    const [loading, setLoading]=useState(0)
    useEffect(()=>{
        setLoading(1)
    },[])
    const [fileName,setFileName]=useState('')
    const dispatch=useDispatch()
    return(
        <div className="CreateFileModal-box">
            
            <div className={loading?"CreateFileModal-bg":"CreateFileModal-bg-loading"} onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}></div>
            <div className= {loading?"CreateFileModal-body":"CreateFileModal-body-loading"}>
                <div className="CreateFileModal-title">Create {type?'Folder':'Note'}</div>
                <div className="CreateFileModal-desc">Set your {type?'folder':'Note'} name</div>
                <input value={fileName} onChange={(e)=>{setFileName(e.target.value)}} placeholder={type?'Folder Name':'Note Name'} className="CreateTeamModal-teaminput"></input>
                <div className="CreateFileModal-buttonbox">
                    <div className="CreateFileModal-accept" onClick={createFile}>Continue</div>
                    <div className="CreateFileModal-no" onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}>Cancel</div>
                </div>
            </div>
            

        </div>
    )
}
export default CreateFileModal