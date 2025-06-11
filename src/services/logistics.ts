import { IStockFilterModel, IStockModel } from "@/types/logistics";
import api from "./api";

const programCode = `${process.env.NEXT_PUBLIC_PROGRAM_CODE}`;

export const getStocks = async (data: IStockFilterModel | null) => {
    const response = await api.get("/stock/get", {
        params: {
            programcode: programCode,
            ...data,
        },
    });
    return response.data.data;
}

export const postAddStock = async (data: IStockModel) => {
    const response = await api.post("/stock/add", {
        ...data,
        programCode,
    });
    return response.data;
}

export const getStockOptions = async () => {
    const response = await api.get("/stock/options", {
        params: {
            programcode: programCode,
        },
    });
    return response.data;
}