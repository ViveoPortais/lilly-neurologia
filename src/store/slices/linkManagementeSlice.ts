import useSession from "@/hooks/useSession";
import { getDoctorCRMUFByProgram, managementNurses } from "@/services/doctor";
import { getNurses, linkDoctor } from "@/services/professions";
import { IDoctorExistsResult } from "@/types/doctor";
import { IReturnMessage } from "@/types/general";
import { IHealthProfessionalByProgramDoctorByProgram } from "@/types/professions";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LinksState {
    loading: boolean;
    error: string | null;
    data: {
        healthProfessionalByProgramDoctorByPrograms: IHealthProfessionalByProgramDoctorByProgram[];
        doctor: IDoctorExistsResult[],
        resultManagementNurses: IReturnMessage | undefined;
        resultAddLink : IReturnMessage | undefined;
    };
}
const initialState: LinksState = {
    loading: false,
    error: null,
    data: {
        healthProfessionalByProgramDoctorByPrograms: [],
        doctor: [],
        resultManagementNurses: undefined,
        resultAddLink : undefined
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

export const fetchDoctorByCrmUf = createAsyncThunk("/doctor/getdoctorcrmufbyprogram", async ({ crm, uf }: { crm: string; uf: string }, thunkAPI) => {
    try {
        const result = await getDoctorCRMUFByProgram(crm, uf);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar médico");;
    }
});

export const managementHealthProfessionalByProgramDoctorByProgram = createAsyncThunk("/doctor/managementNurses", async ({ id, statusCode }: { id: string; statusCode: string }, thunkAPI) => {
    try {
        const result = await managementNurses(id, statusCode);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao editar vínculo");
    }
});

export const addHealthProfessionalByProgramDoctorByProgram = createAsyncThunk("/healthProfessional/healthprofessionalbond", async ({ doctorId }: { doctorId: string; }, thunkAPI) => {
    try {
        const result = await linkDoctor(doctorId);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao solicitar vínculo");
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

            .addCase(fetchDoctorByCrmUf.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorByCrmUf.fulfilled, (state, action) => {
                state.loading = false;
                state.data.doctor = action.payload.value;
            })
            .addCase(fetchDoctorByCrmUf.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(managementHealthProfessionalByProgramDoctorByProgram.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(managementHealthProfessionalByProgramDoctorByProgram.fulfilled, (state, action) => {
                state.loading = false;
                state.data.resultManagementNurses = action.payload;
            })
            .addCase(managementHealthProfessionalByProgramDoctorByProgram.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addHealthProfessionalByProgramDoctorByProgram.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHealthProfessionalByProgramDoctorByProgram.fulfilled, (state, action) => {
                state.loading = false;
                state.data.resultAddLink = action.payload;
            })
            .addCase(addHealthProfessionalByProgramDoctorByProgram.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default linkManagementSlice.reducer;