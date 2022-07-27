import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import yorkie from 'yorkie-js-sdk';
//import anonymous from 'anonymous-animals-gen'; 랜덤 동물 프로필 출력 (필요 없음)
//import randomColor from 'randomcolor'; //랜덤 동물 프로필 출력 (필요 없음)

//Preview 타입 (필요 있을까?)
/*export var Preview;
(function (Preview) {
    Preview["HTML"] = "html";
    Preview["Slide"] = "slide";
})(Preview || (Preview = {}));

//CodeMode 타입 (필요 있을까?)
export var CodeMode;
(function (CodeMode) {
    CodeMode["Markdown"] = "gfm";
    CodeMode["Go"] = "go";
    CodeMode["JavaScript"] = "javascript";
    CodeMode["Clojure"] = "clojure";
    CodeMode["Dart"] = "dart";
    CodeMode["Python"] = "python";
    CodeMode["Ruby"] = "ruby";
    CodeMode["Rust"] = "rust";
})(CodeMode || (CodeMode = {}));
*/

export var DocStatus;
(function (DocStatus) {
    DocStatus["Disconnect"] = "disconnect";
    DocStatus["Connect"] = "connect";
})(DocStatus || (DocStatus = {}));


const initialState = {
    client: null,
    doc: null,
    //mode: CodeMode.Markdown,
    //preview: Preview.HTML,
    loading: true,
    errorMessage: '',
    status: DocStatus.Connect,// 연결되어있는지 ?
};

//client활성화 thunk생성
export const activateClient = createAsyncThunk('doc/activate', async (_, thunkApi) => {
    try {
        //const { name, animal } = anonymous.generate();  필요없음
       /* const options = {
            apiKey: '',
            presence: {
                username: name,x
                image: animal,
                color: randomColor(),
                board: '',
            }, 필요없음
        };*/
        const client = new yorkie.Client(`https://api.fillkie.com/yorkie` );
        await client.activate();
        return { client };
        //client를 만들고 return하는 부분
    }
    catch (err) {
        return thunkApi.rejectWithValue(err.message);
        //에러처리
    }
});
//attach doc thunk 활성화
export const attachDoc = createAsyncThunk('doc/attach', async ({ client, doc }, thunkApi) => {
    try {
        await client.attach(doc);
        doc.update((root) => {
            // codeEditor
            if (!root.content) {
                root.content = new yorkie.Text();
            }
            // board
            if (!root.shapes) {
                root.shapes = [];
            }
        });
        await client.sync();
        return { doc, client };
    }
    catch (err) {
        return thunkApi.rejectWithValue(err.message);
    }
});
const docSlice = createSlice({
    name: 'dosaasc',
    initialState,
    reducers: {
        deactivateClient(state) {
            const { client } = state;
            state.client = undefined;
            client === null || client === void 0 ? void 0 : client.deactivate();
        },
        createDocument(state, action) {
            state.doc = new yorkie.Document(`codepairs$${action.payload}`);
        },
        detachDocument(state) {
            const { doc, client } = state;
            state.doc = undefined;
            client === null || client === void 0 ? void 0 : client.detach(doc);
        },
        attachDocLoading(state, action) {
            state.loading = action.payload;
        },

        setStatus(state, action) {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(activateClient.fulfilled, (state, { payload }) => {
            state.client = payload.client;
        });
        builder.addCase(activateClient.rejected, (state, { payload }) => {
            state.errorMessage = payload;
        });
        builder.addCase(attachDoc.fulfilled, (state, { payload }) => {
            state.doc = payload.doc;
            state.client = payload.client;
        });
        builder.addCase(attachDoc.rejected, (state, { payload }) => {
            state.errorMessage = payload;
        });
    },
});
export const { deactivateClient, createDocument, detachDocument, attachDocLoading, setPreview, setCodeMode, setStatus, } = docSlice.actions;
export default docSlice.reducer;