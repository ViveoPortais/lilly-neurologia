import { IAnnotationModel, IPaginationResult, IReturnMessage} from "@/types/general";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IChangePassword, IUserData } from "@/types/user";
import { IExamCancellationModel, IDiagnosticExamModel, IDiagnosticFilterModel, ExamCreateModel, IDocumentFilledRequestModel, ICancelDigitalSignatureRequest, IRequestSignerModel, IResendDigitalSignatureRequest, IRequestSignModel } from "@/types/diagnostic";
import { cancelDigitalSignature, getAnnotations, getDiagnosticById, getDigitalSignatureDetails, historyDiagnostics, informexamcancellation, resendDigitalSignature } from "@/services/diagnostic";
import { downloadDocumentFilled } from "@/services/annotation";

interface DiagnosticSliceState {
    loading: boolean;
    error: string | null;
    data: {
        myExams : IDiagnosticExamModel[];
        exam : IDiagnosticExamModel | undefined;
        annotations : IAnnotationModel[];
        digitalSignatureDetails : IRequestSignModel | null;
    };
}
const initialState: DiagnosticSliceState = {
    loading: false,
    error: null,
    data: {
        myExams : [],
        exam : undefined,
        annotations : [],
        digitalSignatureDetails : null
    },
};


export const fetchMyDiagnostics = createAsyncThunk("/diagnostic/getdiagnostics", async ({ filterDiagnostic }: { filterDiagnostic: IDiagnosticFilterModel; }, thunkAPI) => {
    try {
        const result = await historyDiagnostics(filterDiagnostic);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const fetchDiagnosticDetailsById = createAsyncThunk("/diagnostic/getdiagnosticbyid", async ({ id }: { id: string; }, thunkAPI) => {
    try {
        const result = await getDiagnosticById(id);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const fetchAnnotations = createAsyncThunk("/annotation/getAnnotations", async ({ id }: { id: string; }, thunkAPI) => {
    try {
        const result = await getAnnotations(id);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const fetchTermAttachFilled = createAsyncThunk("/annotation/documentFilled", async ({ data }: { data: IDocumentFilledRequestModel; }, thunkAPI) => {
    try {
        const result = await downloadDocumentFilled(data);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const postCancellationExam = createAsyncThunk("/exam/cancelExam", async ({ examCancellationModel }: { examCancellationModel: IExamCancellationModel; }, thunkAPI) => {
    try {
        const result = await informexamcancellation(examCancellationModel);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const fetchDigitalSignatureDetails = createAsyncThunk("/DocuSign/Get", async ({ id }: { id: string; }, thunkAPI) => {
    try {
        const result = await getDigitalSignatureDetails(id);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const postCancelDigitalSignatureDetails = createAsyncThunk("exam/cancel-signature", async (data: ICancelDigitalSignatureRequest, thunkAPI) => {
    try {
        const result = await cancelDigitalSignature(data);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const postResendDigitalSignature = createAsyncThunk("exam/resend-digital-signature", async (data: IResendDigitalSignatureRequest, thunkAPI) => {
    try {
        const result = await resendDigitalSignature(data);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao reenviar assinatura digital");
    }
});


const diagnosticSlice = createSlice({
    name: "diagnostic",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyDiagnostics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyDiagnostics.fulfilled, (state, action) => {
                state.loading = false;
                state.data.myExams = action.payload.data;
            })
            .addCase(fetchMyDiagnostics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchDiagnosticDetailsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiagnosticDetailsById.fulfilled, (state, action) => {
                state.loading = false;
                state.data.exam = action.payload as IDiagnosticExamModel;
            })
            .addCase(fetchDiagnosticDetailsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchAnnotations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnnotations.fulfilled, (state, action) => {
                state.loading = false;
                state.data.annotations = action.payload.data;
            })
            .addCase(fetchAnnotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(postCancellationExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postCancellationExam.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(postCancellationExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchTermAttachFilled.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTermAttachFilled.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchTermAttachFilled.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchDigitalSignatureDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDigitalSignatureDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data.digitalSignatureDetails = action.payload as IRequestSignModel;
            })
            .addCase(fetchDigitalSignatureDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default diagnosticSlice.reducer;

