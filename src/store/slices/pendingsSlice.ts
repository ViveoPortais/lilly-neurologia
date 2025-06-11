import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collectionSchedule, getListExamPending, getPendencyReasons, resolvePendency } from "@/services/exams";
import { ExamPendingModel, IPatientSampleCollectionViewModel, PendingResponse, ResolveExamPendency } from "@/types/diagnostic";
import { IReturnMessage } from "@/types/general";
import { IStringMap } from "@/types";

interface PendingsState {
  data: PendingResponse;
  loading: boolean;
  error: string | null;
  reasons: any[];
  collectionScheduleData?: IPatientSampleCollectionViewModel | null;
  selectedExamItem: ExamPendingModel | null;
}

export const fetchPendings = createAsyncThunk<PendingResponse, [string?, string?] | undefined, { rejectValue: string }>(
  "pendings/fetch",
  async (args, thunkAPI) => {
    const [flag, doctorId] = args ?? [];
    try {
      const result = await getListExamPending(doctorId, flag);

      if (!result.isValidData) {
        return thunkAPI.rejectWithValue(result.additionalMessage || "Erro ao carregar pendências");
      }

      const parsed = JSON.parse(result.value);
      return parsed as PendingResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao carregar pendências");
    }
  }
);

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
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue("Erro ao carregar gêneros");
  }
});

export const fetchCollectionSchedule = createAsyncThunk<IPatientSampleCollectionViewModel, string, { rejectValue: string }>(
  "pendings/fetchCollectionSchedule",
  async (examId, thunkAPI) => {
    try {
      const result = await collectionSchedule(examId);

      if (!result.isValidData) {
        return thunkAPI.rejectWithValue(result.additionalMessage || "Erro ao buscar dados da amostra");
      }

      return JSON.parse(result.value) as IPatientSampleCollectionViewModel;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao buscar dados da amostra");
    }
  }
);

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
    problemWithSamples: [],
    confirmSampleDeliveries: [],
    analyze: [],
  },
  collectionScheduleData: null,
  loading: false,
  error: null,
  reasons: [],
  selectedExamItem: null,
};

const pendingsSlice = createSlice({
  name: "pendings",
  initialState,
  reducers: {
    setSelectedExamItem: (state, action: PayloadAction<ExamPendingModel>) => {
      state.selectedExamItem = action.payload;
    },
    clearSelectedExamItem: (state) => {
      state.selectedExamItem = null;
      state.collectionScheduleData = null;
    },
  },
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
      })

      .addCase(fetchCollectionSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.collectionScheduleData = action.payload;
      })
      .addCase(fetchCollectionSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedExamItem, clearSelectedExamItem } = pendingsSlice.actions;
export default pendingsSlice.reducer;