import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    loading: true,  // ✅ new
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false; // ✅ finished loading
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  }
})

export const { setUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;
