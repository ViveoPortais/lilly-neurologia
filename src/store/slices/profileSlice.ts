import { IReturnMessage} from "@/types/general";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUserData } from "@/types/user";
import { getUserInfo, updateProfessional } from "@/services/user";
import { IMedicalSpecialty, IUpdateDoctorData } from "@/types";
import { getListSpecialties, updateDoctor } from "@/services/doctor";
import { AddressData } from "@/services/api";
import { IUpdateProfessionalData } from "@/types/professions";

interface ProfileState {
    loading: boolean;
    error: string | null;
    data: {
        userInfo : IReturnMessage<IUserData> | undefined;
        medicalSpecialties : IMedicalSpecialty[];
        resultCEP : any | undefined;
        resultUpdate : IReturnMessage | undefined;
    };
}
const initialState: ProfileState = {
    loading: false,
    error: null,
    data: {
        userInfo : undefined,
        medicalSpecialties : [],
        resultCEP : undefined,
        resultUpdate : undefined
    },
};


export const fetchUserData = createAsyncThunk("/user/getuserdata", async (_, thunkAPI) => {
    try {
        const result = await getUserInfo();
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados do usuário");
    }
});

export const fetchMedicalSpecialties = createAsyncThunk("/doctor/getspecialties", async (_, thunkAPI) => {
    try {
        const result = await getListSpecialties();
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar especialidades");
    }
});

export const fetchCEP = createAsyncThunk("viacep.com.br/ws/", async ({ cep }: { cep: string; }, thunkAPI) => {
    try {
        const result = await AddressData(cep);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar cep");
    }
});

export const putUpdateDoctor = createAsyncThunk("doctor/update", async ({ doctor }: { doctor: IUpdateDoctorData; }, thunkAPI) => {
    try {
        const result = await updateDoctor(doctor);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao atualizar dados");
    }
});

export const putUpdateProfessional = createAsyncThunk("healthprofessional/updatehealthprofessional", async ({ professional }: { professional: IUpdateProfessionalData; }, thunkAPI) => {
    try {
        const result = await updateProfessional(professional);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao atualizar dados");
    }
});


const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.data.userInfo = action.payload;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchMedicalSpecialties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedicalSpecialties.fulfilled, (state, action) => {
                state.loading = false;
                state.data.medicalSpecialties = action.payload;
            })
            .addCase(fetchMedicalSpecialties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchCEP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCEP.fulfilled, (state, action) => {
                state.loading = false;
                state.data.resultCEP = action.payload;
            })
            .addCase(fetchCEP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(putUpdateDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(putUpdateDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.data.resultUpdate = action.payload;
            })
            .addCase(putUpdateDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(putUpdateProfessional.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(putUpdateProfessional.fulfilled, (state, action) => {
                state.loading = false;
                state.data.resultUpdate = action.payload;
            })
            .addCase(putUpdateProfessional.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default profileSlice.reducer;