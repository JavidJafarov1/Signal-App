import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  authToken: '',
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
  },
});

export const {setAuthToken} = AuthSlice.actions;
export default AuthSlice.reducer;
