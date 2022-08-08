import './CreateFileModal.scss';
import {useCallback,useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IsCreateFile} from '../../reducer/file_reducer';
import { useParams } from 'react-router';
import { getCookie } from '../../cookie';
import { setDirInfo,setFileInfo } from '../../reducer/file_reducer';
import { nodeAxios } from '../../apis/api';
import Loading from '../../Loading/Loading';
const CreateFileModal=({type})=>
{
    const {id}=useParams()
    const dirId=useSelector(state=>state.file_reducer.dirId)
    const createFile=()=>
    {
        if(apiloading==1)
        {
            return;
        }
        setApiloading(1)
        nodeAxios.post(`/${type?'dir':'file'}`,{
            projectId:id,
            folderId:dirId,
            name:fileName
        }).then(()=>nodeAxios.get(`/dir?projectId=${id}&folderId=${dirId}`).then((response)=>{
            setApiloading(0)
            dispatch(setFileInfo(dirId,response.data.data));
            setLoading(0);
            setTimeout(()=>removeComponent(),300)}))
    }
    const removeComponent=()=>
    {
        setApiloading(0)
        dispatch(IsCreateFile(0))
    }
    const [apiloading, setApiloading]=useState(0)
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
                    <div className="CreateFileModal-accept" onClick={createFile}>
                    {(apiloading==0)?<div>Continue</div>:
                        <Loading></Loading>}
                    </div>
                    <div className="CreateFileModal-no" onClick={()=>{ setLoading(0);setTimeout(()=>removeComponent(),300)}}>Cancel</div>
                </div>
            </div>
            

        </div>
    )
}
export default CreateFileModal