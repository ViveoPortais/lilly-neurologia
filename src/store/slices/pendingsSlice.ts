import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListExamPending } from "@/services/exams";
import { ExamPendingModel } from "@/types/diagnostic";

interface PendingsState {
 data: ExamPendingModel[];
 loading: boolean;
 error: string | null;
}

export const fetchPendings = createAsyncThunk<ExamPendingModel[], void, { rejectValue: string }>("pendings/fetch", async (_, thunkAPI) => {
 try {
  const result = await getListExamPending();

  if (!result.isValidData) {
   return thunkAPI.rejectWithValue(result.additionalMessage || "Erro ao carregar pendências");
  }

  const parsed = JSON.parse(result.value) as ExamPendingModel[];
  return parsed;
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar pendências");
 }
});

const initialState: PendingsState = {
  data: [],
  loading: false,
  error: null,
};

const pendingsSlice = createSlice({
 name: "pendings",
 initialState,
 reducers: {},
 extraReducers: (builder) => {
  builder
   .addCase(fetchPendings.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchPendings.fulfilled, (state, action) => {
    state.loading = false;
    state.data = action.payload;
   })
   .addCase(fetchPendings.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   });
 },
});

export default pendingsSlice.reducer;
