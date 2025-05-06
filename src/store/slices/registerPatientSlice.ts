import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IStringMap } from "@/types";
import { diseases, exams, gender, labs, registerPatient } from "@/services/registerPatient";

interface RegisterPatientState {
 loading: boolean;
 error: string | null;
 data: {
  genders: IStringMap[];
  exams: IStringMap[];
  labs: IStringMap[];
  diseases: IStringMap[];
 };
}

const initialState: RegisterPatientState = {
 loading: false,
 error: null,
 data: {
  genders: [],
  exams: [],
  labs: [],
  diseases: [],
 },
};

export const fetchDiseases = createAsyncThunk("registerPatient/fetchDiseases", async (_, thunkAPI) => {
 try {
  const result = await diseases();

  const transformed = result.map((item: any) => ({
   stringMapId: item.id,
   optionName: item.name,
  }));

  return transformed as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar patologias");
 }
});

export const fetchExams = createAsyncThunk("registerPatient/fetchExams", async (_, thunkAPI) => {
 try {
  const result = await exams();

  const transformed = result.map((item: any) => ({
   stringMapId: item.id,
   optionName: item.name,
  }));

  return transformed as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar exames");
 }
});

export const fetchLabs = createAsyncThunk("registerPatient/fetchLabs", async (_, thunkAPI) => {
 try {
  const result = await labs();

  const transformed = result.map((item: any) => ({
   stringMapId: item.id,
   optionName: item.name,
  }));

  return transformed as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar laboratórios");
 }
});

export const fetchGenders = createAsyncThunk("registerPatient/fetchGenders", async (_, thunkAPI) => {
 try {
  const result = await gender();

  const transformed = result.map((item: any) => ({
   stringMapId: item.id,
   optionName: item.name,
  }));

  return transformed as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar gêneros");
 }
});

export const searchPatientByCpf = createAsyncThunk("registerPatient/searchPatientByCpf", async (cpf: string, { rejectWithValue }) => {
 try {
  const result = await registerPatient({ cpf });
  return result;
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao submeter CPF");
 }
});

const registerPatientSlice = createSlice({
 name: "registerPatient",
 initialState,
 reducers: {},
 extraReducers: (builder) => {
  builder

   // Genders
   .addCase(fetchGenders.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchGenders.fulfilled, (state, action) => {
    state.loading = false;
    state.data.genders = action.payload;
   })
   .addCase(fetchGenders.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   // Exams
   .addCase(fetchExams.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchExams.fulfilled, (state, action) => {
    state.loading = false;
    state.data.exams = action.payload;
   })
   .addCase(fetchExams.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   // Labs
   .addCase(fetchLabs.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchLabs.fulfilled, (state, action) => {
    state.loading = false;
    state.data.labs = action.payload;
   })
   .addCase(fetchLabs.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   // Diseases
   .addCase(fetchDiseases.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchDiseases.fulfilled, (state, action) => {
    state.loading = false;
    state.data.diseases = action.payload;
   })
   .addCase(fetchDiseases.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   .addCase(searchPatientByCpf.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(searchPatientByCpf.fulfilled, (state) => {
    state.loading = false;
   })
   .addCase(searchPatientByCpf.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   });
 },
});

export default registerPatientSlice.reducer;
