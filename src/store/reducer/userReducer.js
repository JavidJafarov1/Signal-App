import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userList: {},
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAllUser: (state, action) => {
      state.userList = action.payload;
    },
  },
});

export const {setAllUser} = UserSlice.actions;
export default UserSlice.reducer;
