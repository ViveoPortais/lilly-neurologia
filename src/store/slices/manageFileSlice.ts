import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AnnotationModel, IAnnotationFilterModel } from "@/types/general";
import { addAnnotation, deleteAnnotation, getAnnotationsFile, updateAnnotation } from "@/services/annotation";

interface ManageFileState {
 loading: boolean;
 error: string | null;
 annotations: AnnotationModel[];
}

const initialState: ManageFileState = {
 loading: false,
 error: null,
 annotations: [],
};

export const submitAnnotation = createAsyncThunk("manageFile/submitAnnotation", async (data: AnnotationModel, { rejectWithValue }) => {
 try {
  const response = await addAnnotation(data);
  return response;
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao adicionar anotação.");
 }
});

export const fetchGetAnnotations = createAsyncThunk("annotations/getAnnotations", async (_, { rejectWithValue }) => {
 const filter: IAnnotationFilterModel = {
  entityMetadataIdName: "HealthProgram",
  regardingObjectId: "89323CB1-1E8E-4302-B60A-D081A2F64F7B",
 };

 try {
  return await getAnnotationsFile(filter);
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao buscar anotações");
 }
});

export const fetchUpdateAnnotation = createAsyncThunk("manageFile/updateAnnotation", async (data: AnnotationModel, { rejectWithValue }) => {
 try {
  const response = await updateAnnotation(data);
  return response;
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao alterar arquivo.");
 }
});

export const submitDeleteAnnotation = createAsyncThunk("manageFile/deleteAnnotation", async (data: AnnotationModel, { rejectWithValue }) => {
 try {
  const response = await deleteAnnotation(data);
  return response;
 } catch (error: any) {
  return rejectWithValue(error.response?.data || "Erro ao alterar arquivo.");
 }
});

const manageFileSlice = createSlice({
 name: "manageFile",
 initialState,
 reducers: {},
 extraReducers: (builder) => {
  builder
   .addCase(submitAnnotation.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(submitAnnotation.fulfilled, (state) => {
    state.loading = false;
   })
   .addCase(submitAnnotation.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   .addCase(fetchGetAnnotations.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchGetAnnotations.fulfilled, (state, action) => {
    state.loading = false;
    state.annotations = action.payload.data;
   })
   .addCase(fetchGetAnnotations.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

   .addCase(fetchUpdateAnnotation.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(fetchUpdateAnnotation.fulfilled, (state) => {
    state.loading = false;
   })
   .addCase(fetchUpdateAnnotation.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })

    .addCase(submitDeleteAnnotation.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(submitDeleteAnnotation.fulfilled, (state) => {
    state.loading = false;
   })
   .addCase(submitDeleteAnnotation.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   });
 },
});

export default manageFileSlice.reducer;
