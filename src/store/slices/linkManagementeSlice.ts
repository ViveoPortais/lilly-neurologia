import useSession from "@/hooks/useSession";
import { getNurses } from "@/services/professions";
import { IHealthProfessionalByProgramDoctorByProgram } from "@/types/professions";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LinksState {
 loading: boolean;
 error: string | null;
 data: {
  healthProfessionalByProgramDoctorByPrograms: IHealthProfessionalByProgramDoctorByProgram[];
 };
}
const initialState: LinksState = {
 loading: false,
 error: null,
 data: {
    healthProfessionalByProgramDoctorByPrograms : []
 },
};


export const fetchHealthProfessionalByProgramDoctorByPrograms = createAsyncThunk("/healthProfessional/healthProfessionalByProgramDoctorByProgram", async (_, thunkAPI) => {
    try {
        const result = await getNurses();
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar vínculos");
    }
});


const linkManagementSlice = createSlice({
    name: "linkManagement",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
     builder
        .addCase(fetchHealthProfessionalByProgramDoctorByPrograms.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchHealthProfessionalByProgramDoctorByPrograms.fulfilled, (state, action) => {
            state.loading = false;
            state.data.healthProfessionalByProgramDoctorByPrograms = action.payload.data;
        })
        .addCase(fetchHealthProfessionalByProgramDoctorByPrograms.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
   });
   
   export default linkManagementSlice.reducer;