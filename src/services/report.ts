import { IPowerBIDashboardRequestModel } from "@/types/general";
import api from "./api";

export const getDashboard = async (data: IPowerBIDashboardRequestModel) => {
    const response = await api.get("/powerbi/report", {
        params: {
            reportId: data.reportId,
            groupId: data.groupId,
        },
    });
    return response.data;
}