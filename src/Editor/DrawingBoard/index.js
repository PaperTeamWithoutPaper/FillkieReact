import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Board from './Canvas/Board';

export default function DrawingBoard({width, height}) {
  const canvasRef = useRef();
  const boardRef = useRef();
  const client = useSelector(state => state.docReducer.client);
  const doc = useSelector(state => state.docReducer.doc);


  useEffect(() => {
    if (!canvasRef.current) {
      return () => {};
    }
    if(!doc){
        return ()=>{};
    }
    const board = new Board(canvasRef.current, doc.update.bind(doc));
    boardRef.current = board;

    return () => {
      board.destroy();
    };
  }, [doc]);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        boardRef.current?.drawAll(doc.getRoot().shapes);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  useEffect(() => {
    if (!client || !doc) {
      return () => {};
    }

    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'peers-changed') {
        const documentKey = doc.getKey();
        const changedPeers = event.value[documentKey];

        for (const peerKey of Object.keys(changedPeers)) {
          boardRef.current?.updateMetadata(peerKey, changedPeers[peerKey]);
        }
      }
    });

    const clientId = client.getID();
    const handleUpdateMeta = (data) => {
      const board = JSON.stringify(data || '');
      boardRef.current?.updateMetadata(clientId, {
        board,
      });
      client?.updatePresence('board', board);
    };

    boardRef.current?.addEventListener('mousemove', handleUpdateMeta);
    boardRef.current?.addEventListener('mousedown', handleUpdateMeta);
    boardRef.current?.addEventListener('mouseout', handleUpdateMeta);
    boardRef.current?.addEventListener('mouseup', handleUpdateMeta);

    return () => {
      unsubscribe();
      boardRef.current?.removeEventListener('mousemove', handleUpdateMeta);
      boardRef.current?.removeEventListener('mousedown', handleUpdateMeta);
      boardRef.current?.removeEventListener('mouseout', handleUpdateMeta);
      boardRef.current?.removeEventListener('mouseup', handleUpdateMeta);
    };
  }, [doc]);


  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    boardRef.current?.setWidth(width);
    boardRef.current?.setHeight(height);
    boardRef.current?.drawAll(doc.getRoot().shapes);
  }, [doc, width, height]);

  return <canvas ref={canvasRef} />;
}