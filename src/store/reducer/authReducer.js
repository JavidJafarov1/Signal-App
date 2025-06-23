import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userDetails: {},
  allartist: [],
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setuserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setArtistData: (state, action) => {
      state.allartist = action.payload;
    },
  },
});

export const {setuserDetails, setArtistData} = AuthSlice.actions;
export default AuthSlice.reducer;
