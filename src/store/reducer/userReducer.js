import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userList: {},
  groupList: {},
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAllUser: (state, action) => {
      state.userList = action.payload;
    },
    setGroupDetails: (state, action) => {
      state.groupList = action.payload;
    },
  },
});

export const {setAllUser, setGroupDetails} = UserSlice.actions;
export default UserSlice.reducer;
