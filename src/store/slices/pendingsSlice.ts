import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListExamPending, getPendencyReasons, resolvePendency } from "@/services/exams";
import { ExamPendingModel, PendingResponse, ResolveExamPendency } from "@/types/diagnostic";
import { IReturnMessage } from "@/types/general";
import { IStringMap } from "@/types";

interface PendingsState {
 data: PendingResponse;
 loading: boolean;
 error: string | null;
 reasons: IStringMap[];
}

export const fetchPendings = createAsyncThunk<PendingResponse, void, { rejectValue: string }>("pendings/fetch", async (_, thunkAPI) => {
 try {
  const result = await getListExamPending();

  if (!result.isValidData) {
   return thunkAPI.rejectWithValue(result.additionalMessage || "Erro ao carregar pendências");
  }

  const parsed = JSON.parse(result.value);
  return parsed as PendingResponse;
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar pendências");
 }
});

export const examResolvePendency = createAsyncThunk<IReturnMessage<string>, ExamPendingModel, { rejectValue: string }>(
 "pendings/resolve",
 async (model, thunkAPI) => {
  try {
   const result = await resolvePendency(model);
   return result;
  } catch (err: any) {
   return thunkAPI.rejectWithValue("Erro ao resolver pendência");
  }
 }
);

export const fetchPendencyReasons = createAsyncThunk("pendings/fetchReasons", async (_, thunkAPI) => {
 try {
  const result = await getPendencyReasons();

  const transformed = result.map((item: any) => ({
   stringMapId: item.id,
   optionName: item.name,
  }));

  return transformed as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar gêneros");
 }
});

const initialState: PendingsState = {
 data: {
  documents: [],
  labels: [],
  tubes: [],
  batchPendingDeclarations: [],
  generateBatchDeclarations: [],
  pendingAssociations: [],
  confirmPickupRequests: [],
  pickupRequests: [],
 },
 loading: false,
 error: null,
 reasons: [],
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
   })

   .addCase(examResolvePendency.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(examResolvePendency.fulfilled, (state, action) => {
    state.loading = false;
   })
   .addCase(examResolvePendency.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   .addCase(fetchPendencyReasons.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchPendencyReasons.fulfilled, (state, action) => {
    state.loading = false;
    state.reasons = action.payload;
   })
   .addCase(fetchPendencyReasons.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   });
 },
});

export default pendingsSlice.reducer;
