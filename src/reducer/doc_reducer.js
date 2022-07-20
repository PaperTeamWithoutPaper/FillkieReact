export const activateClient = createAsyncThunk<ActivateClientResult, undefined, rejectValue>(
    'doc/activate',
    async (_: undefined, thunkApi) => {
      try {
        const { name, animal } = anonymous.generate();
        const options = {
          apiKey: '',
          presence: {
            username: name,
            image: animal,
            color: randomColor(),
            board: '',
          },
        };
  
        if (`${process.env.REACT_APP_YORKIE_API_KEY}`) {
          options.apiKey = `${process.env.REACT_APP_YORKIE_API_KEY}`;
        }
  
        const client = new yorkie.Client(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`, options);
  
        await client.activate();
        return { client };
      } catch (err) {
        return thunkApi.rejectWithValue(err.message);
      }
    },
  );