import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IStringMap } from "@/types";
import { diseases, exams, gender, getDoctor, labs, linkedDoctor, registerPatient, searchPatient } from "@/services/registerPatient";
import { ExamCreateModel } from "@/types/diagnostic";

interface RegisterPatientState {
 loading: boolean;
 loadingSearchPatient: boolean;
 isSubmitting: boolean;
 error: string | null;
 data: {
  genders: IStringMap[];
  exams: IStringMap[];
  labs: IStringMap[];
  diseases: IStringMap[];
  foundPatient?: any;
  doctorId?: string | null;
  linkedDoctor?: IStringMap[];
 };
}

const initialState: RegisterPatientState = {
 loading: false,
 loadingSearchPatient: false,
 isSubmitting: false,
 error: null,
 data: {
  genders: [],
  exams: [],
  labs: [],
  diseases: [],
  doctorId: null,
  linkedDoctor: [],
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
   stringMapId: item.stringMapId,
   optionName: item.optionName,
  }));

  return transformed as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar gêneros");
 }
});

export const searchPatientByCpf = createAsyncThunk("registerPatient/searchPatientByCpf", async (cpf: string, { rejectWithValue }) => {
 try {
  const result = await searchPatient(cpf);
  return result;
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao submeter CPF");
 }
});

export const submitPatientRegistration = createAsyncThunk(
 "registerPatient/submitPatientRegistration",
 async (data: ExamCreateModel, { rejectWithValue }) => {
  try {
   const response = await registerPatient(data);
   return response;
  } catch (error: any) {
   return rejectWithValue(error.response?.data || "Erro ao registrar paciente");
  }
 }
);

export const getDoctorInfo = createAsyncThunk("registerPatient/getDoctorInfo", async (_, thunkAPI) => {
 try {
  const result = await getDoctor();
  return result.doctorId;
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao carregar patologias");
 }
});

export const getLinkedDoctor = createAsyncThunk("registerPatient/getLinkedDoctor", async (_, thunkAPI) => {
 try {
  const res = await linkedDoctor();
  const doctors = res.value.doctors;
  const mapping = doctors.map((doctor: any) => ({
   stringMapId: doctor.doctorId,
   optionName: doctor.name,
  }));

  return mapping as IStringMap[];
 } catch (error) {
  return thunkAPI.rejectWithValue("Erro ao buscar vínculos.");
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
    state.loadingSearchPatient = true;
    state.error = null;
   })
   .addCase(searchPatientByCpf.fulfilled, (state, action) => {
    state.loadingSearchPatient = false;
    state.data.foundPatient = action.payload;
   })
   .addCase(searchPatientByCpf.rejected, (state, action) => {
    state.loadingSearchPatient = false;
    state.error = action.payload as string;
    state.data.foundPatient = undefined;
   })

   .addCase(submitPatientRegistration.pending, (state) => {
    state.isSubmitting = true;
    state.error = null;
   })
   .addCase(submitPatientRegistration.fulfilled, (state) => {
    state.isSubmitting = false;
   })
   .addCase(submitPatientRegistration.rejected, (state, action) => {
    state.isSubmitting = false;
    state.error = action.payload as string;
   })

   .addCase(getDoctorInfo.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(getDoctorInfo.fulfilled, (state, action) => {
    state.loading = false;
    state.data.doctorId = action.payload;
   })
   .addCase(getDoctorInfo.rejected, (state, action) => {
    state.loading = false;
    state.data.doctorId = null;
    state.error = action.payload as string;
   })

   .addCase(getLinkedDoctor.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(getLinkedDoctor.fulfilled, (state, action) => {
    state.loading = false;
    state.data.linkedDoctor = action.payload;
   })
   .addCase(getLinkedDoctor.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   });
 },
});

export default registerPatientSlice.reducer;
