import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStringMapLists, getStringMaps } from "@/services/basic";
import { IStringMap } from "@/types";

interface BasicSliceState {
  loading: boolean;
  error: string | null;
  data: {
    stringMaps: IStringMap[];
    stringMapList: IStringMap[];
  };
}
const initialState: BasicSliceState = {
  loading: false,
  error: null,
  data: {
    stringMaps: [],
    stringMapList: [],
  },
};

export const fetchStringMaps = createAsyncThunk(
  "/basic/fetchStringMaps",
  async ({ entityName, attributeName }: { entityName: string; attributeName: string }, thunkAPI) => {
    try {
      const result = await getStringMaps(entityName, attributeName);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
  }
);

export const fetchStringMapsList = createAsyncThunk(
  "/basic/fetchStringMapsList",
  async ({ entityName, attributeName }: { entityName: string; attributeName: string }, thunkAPI) => {
    try {
      const result = await getStringMapLists(entityName, attributeName);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
  }
);

const basicSlice = createSlice({
  name: "basic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStringMaps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStringMaps.fulfilled, (state, action) => {
        state.loading = false;
        state.data.stringMaps = action.payload;
      })
      .addCase(fetchStringMaps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStringMapsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStringMapsList.fulfilled, (state, action) => {
        state.loading = false;
        state.data.stringMapList = action.payload;
      })
      .addCase(fetchStringMapsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default basicSlice.reducer;