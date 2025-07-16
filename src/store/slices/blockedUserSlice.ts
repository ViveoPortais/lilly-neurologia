import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlockedUsers, unblockUser } from "@/services/user";
import { IBlockedUser, IUnblockUserRequest } from "@/types/user";

interface BlockedUsersState {
  data: IBlockedUser[];
  loading: boolean;
  error: string | null;
}

const initialState: BlockedUsersState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchBlockedUsers = createAsyncThunk("blockedUsers/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    return await getBlockedUsers();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const unblockUserById = createAsyncThunk("blockedUsers/unblock", async (dto: IUnblockUserRequest, { dispatch, rejectWithValue }) => {
  try {
    const result = await unblockUser(dto);
    dispatch(fetchBlockedUsers());
    return result;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const blockedUsersSlice = createSlice({
  name: "blockedUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default blockedUsersSlice.reducer;