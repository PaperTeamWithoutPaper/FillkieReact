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
  const  docKey  = 'asd';
  const dispatch = useDispatch();
  const client = useSelector(state => state.docReducer.client);
  const doc = useSelector(state => state.docReducer.doc);
  const status = useSelector(state => state.docReducer.status);

  const loading = useSelector(state => state.docReducer.loading);
  const errorMessage = useSelector(state => state.docReducer.errorMessage);

  useEffect(() => {
    dispatch(activateClient());
    console.log(client)
    return () => {
      dispatch(deactivateClient());
    };
  }, []);

  useEffect(() => {
    if (!client || !doc) {
      return () => {};
    }

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
      } if (status === DocStatus.Connect &&
        ((event.type === 'status-changed' && event.value === 'deactivated') ||
            (event.type === 'stream-connection-status-changed' && event.value === 'disconnected') ||
            (event.type === 'document-synced' && event.value === 'sync-failed'))) {
        dispatch(setStatus(DocStatus.Disconnect));
    }
    else if (status === DocStatus.Disconnect &&
        (event.type === 'peers-changed' ||
            event.type === 'documents-changed' ||
            (event.type === 'status-changed' && event.value === 'activated') ||
            (event.type === 'stream-connection-status-changed' && event.value === 'connected') ||
            (event.type === 'document-synced' && event.value === 'synced'))) {
        dispatch(setStatus(DocStatus.Connect));
    }
});
return () => {
    unsubscribe();
};
}, [client, doc, status]);
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
    dispatch(attachDocLoading(true));
    await dispatch(attachDoc({ client, doc }));
    

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