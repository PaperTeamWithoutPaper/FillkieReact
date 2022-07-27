import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  activateClient,
  deactivateClient,
  createDocument,
  detachDocument,
  attachDoc,
  attachDocLoading,
  DocStatus,
  setStatus,
} from '../reducer/docSlices';
import { syncPeer } from '../reducer/peerSlices';
import Editor, { NAVBAR_HEIGHT } from './Editor';


// eslint-disable-next-line func-names
export default function DocLoader() {
  const  docKey  = 'asdasasssd';
  const dispatch = useDispatch();
  const client = useSelector(state => state.docReducer.client);
  const doc = useSelector(state => state.docReducer.doc);
  const status = useSelector(state => state.docReducer.status);

  const loading = useSelector(state => state.docReducer.loading);
  const errorMessage = useSelector(state => state.docReducer.errorMessage);

  //client activate in slices
  useEffect(() => {
    dispatch(activateClient()); 
    return () => {
      dispatch(deactivateClient());
    };
  }, []);
  //client subscribe to doc
  useEffect(() => {
    // client activate OR doc activate 이전에 subscribe 실행시 에러처리
    if (!client || !doc) {
      return () => {};
    }
    //사용자 변경시
    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'peers-changed') {
        const documentKey = doc.getKey();
        const changedPeers = event.value[documentKey];
        dispatch(
          syncPeer({
            myClientID: client.getID(),
            changedPeers,
          }),
        );
        //사용자 나갈 때
      } if (status === DocStatus.Connect &&
        ((event.type === 'status-changed' && event.value === 'deactivated') ||
            (event.type === 'stream-connection-status-changed' && event.value === 'disconnected') ||
            (event.type === 'document-synced' && event.value === 'sync-failed'))) {
        dispatch(setStatus(DocStatus.Disconnect));
    }
    //사용자 들어올 때
    else if (status === DocStatus.Disconnect &&
        (event.type === 'peers-changed' ||
            event.type === 'documents-changed' ||
            (event.type === 'status-changed' && event.value === 'activated') ||
            (event.type === 'stream-connection-status-changed' && event.value === 'connected') ||
            (event.type === 'document-synced' && event.value === 'synced'))) {
        dispatch(setStatus(DocStatus.Connect));
    }
});
//status 변경시 subscribe
return () => {
    unsubscribe();
};
}, [client, doc, status]);

//document 생성
useEffect(() => {
dispatch(createDocument(docKey));

return () => {
    dispatch(detachDocument());
};
}, [docKey]);
useEffect(() => {
async function attachDocAsync() {
    if (!client || !doc) {
        return;
    }
    //loading 시작
    dispatch(attachDocLoading(true));
    //client에 doc attach
    await dispatch(attachDoc({ client, doc }));
    //loading 끝
    dispatch(attachDocLoading(false));
}
attachDocAsync();
return () => {
    dispatch(attachDocLoading(true));
};
}, [docKey, client, doc]);

      

  return (
    <Editor></Editor>
  )

}