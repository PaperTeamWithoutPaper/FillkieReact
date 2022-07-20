import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';



import {
  activateClient,
  deactivateClient,
  createDocument,
  detachDocument,
  attachDoc,
  attachDocLoading,
  CodeMode,
  setCodeMode,
  Preview,
  setPreview,
  DocStatus,
  setStatus,
} from 'features/docSlices';
import { syncPeer } from 'features/peerSlices';
import Editor, { NAVBAR_HEIGHT } from './Editor';


// eslint-disable-next-line func-names
export default function DocLoader(props) {
  const { docKey } = props;
  const dispatch = useDispatch();
  const client = useSelector(state => state.docState.client);
  const doc = useSelector(state => state.docState.doc);
  const status = useSelector(state => state.docState.status);
  const tool = useSelector(state => state.boardState.toolType);
  const loading = useSelector(state => state.docState.loading);
  const errorMessage = useSelector(state => state.docState.errorMessage);

  useEffect(() => {
    dispatch(activateClient());
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
      }

      if (
        status === DocStatus.Connect &&
        ((event.type === 'status-changed' && event.value === 'deactivated') ||
          (event.type === 'stream-connection-status-changed' && event.value === 'disconnected') ||
          (event.type === 'document-synced' && event.value === 'sync-failed'))
      ) {
        dispatch(setStatus(DocStatus.Disconnect));
      } else if (
        status === DocStatus.Disconnect &&
        (event.type === 'peers-changed' ||
          event.type === 'documents-changed' ||
          (event.type === 'status-changed' && event.value === 'activated') ||
          (event.type === 'stream-connection-status-changed' && event.value === 'connected') ||
          (event.type === 'document-synced' && event.value === 'synced'))
      ) {
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
      dispatch(setCodeMode(doc.getRoot().mode || CodeMode.Markdown));
      dispatch(setPreview(doc.getRoot().preview || Preview.HTML));
      dispatch(attachDocLoading(false));
    }

    attachDocAsync();
    return () => {
      dispatch(attachDocLoading(true));
    };
  }, [docKey, client, doc]);

  if (errorMessage) {
    console.log('error occured!')
  }

  if (loading || !client || !doc) {
    console.log('loading')
  }

  return <div>asd</div>;
}