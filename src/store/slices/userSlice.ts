import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";
import { IChangePassword } from "@/types/user";
import { changePassword } from "@/services/user";

export const changePasswordSlice = createAsyncThunk("user/changePassword", async (data: IChangePassword, { rejectWithValue }) => {
 try {
  const response = await changePassword(data);
  return response;
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao alterar a senha");
 }
});

const userSlice = createSlice({
 name: "user",
 initialState: {
  loading: false,
  error: null,
 },
 reducers: {},
 extraReducers: (builder) => {
  builder
   .addCase(changePasswordSlice.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(changePasswordSlice.fulfilled, (state) => {
    state.loading = false;
   })
   .addCase(changePasswordSlice.rejected, (state, action) => {
    state.loading = false;
   });
 },
});

export default userSlice.reducer;
