import { createSlice } from '@reduxjs/toolkit';
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["Connected"] = "connected";
    ConnectionStatus["Disconnected"] = "disconnected";
})(ConnectionStatus || (ConnectionStatus = {}));
const initialPeerState = {
    peers: {},
};
const peerSlice = createSlice({
    name: 'peer',
    initialState: initialPeerState,
    reducers: {
        syncPeer(state, action) {
            const { myClientID, changedPeers } = action.payload;
            const { peers } = state;
            for (const clientID of Object.keys(peers)) {
                if (!changedPeers[clientID]) {
                    peers[clientID].status = ConnectionStatus.Disconnected;
                }
            }
            for (const [clientID, metadata] of Object.entries(changedPeers)) {
                if (!peers[clientID] || peers[clientID].status === ConnectionStatus.Disconnected) {
                    const peer = {
                        id: clientID,
                        status: ConnectionStatus.Connected,
                        metadata,
                        isMine: myClientID === clientID,
                    };
                    state.peers[clientID] = peer;
                }
            }
        },
    },
});
export const { syncPeer } = peerSlice.actions;
export default peerSlice.reducer;