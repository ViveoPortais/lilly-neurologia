import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IStockFilterModel, IStockModel } from "@/types/logistics";
import { getStockOptions, getStocks, postAddStock } from "@/services/logistics";

interface LogisticsSliceState {
    loading: boolean;
    error: string | null;
    data: {
        stocks : IStockModel[];
    };
}
const initialState: LogisticsSliceState = {
    loading: false,
    error: null,
    data: {
        stocks : [],
    },
};


export const fetchStocks = createAsyncThunk("/stock/get", async ({ filterStock }: { filterStock: IStockFilterModel | null; }, thunkAPI) => {
    try {
        const result = await getStocks(filterStock);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const addStock = createAsyncThunk("/stock/add", async ({ data }: { data: IStockModel }, thunkAPI) => {
    try {
        const result = await postAddStock(data);
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

export const fetchStocksOptions = createAsyncThunk("/stock/options", async (_, thunkAPI) => {
    try {
        const result = await getStockOptions();
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue("Erro ao carregar dados");
    }
});

const logisticsSlice = createSlice({
    name: "logistics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStocks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.loading = false;
                state.data.stocks = action.payload;
            })
            .addCase(fetchStocks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addStock.pending, (state, action) => {
                state.loading = true;
            })
    },
});

export default logisticsSlice.reducer;

