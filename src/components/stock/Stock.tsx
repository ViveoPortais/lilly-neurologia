"use client";

import { DataTable } from "@/components/dashboard/DataTable";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLoading } from "@/contexts/LoadingContext";
import { ILogisticsStuffModel, IStockFilterModel, IStockViewModel } from "@/types/logistics";
import { fetchStocks, fetchStocksOptions } from "@/store/slices/logisticsSlice";
import { IPaginationResult, IReturnMessage } from "@/types/general";
import FormAddStock from "./FormAddStock";


export default function Stock() {

    const dispatch = useAppDispatch();
    const stocks = useAppSelector((state) => state.logistics.data.stocks);
    const loading = useAppSelector((state) => state.logistics.loading);
    const [logisticsStuffs, setLogisticsStuffs] = useState<ILogisticsStuffModel[]>([])

    const { show, hide } = useLoading();

    useEffect(() => {
        if (loading)
            show()
        else
            hide()
    }, [loading])

    useEffect(() => {
        const fetchData = async()=>{
            const filterStock: IStockFilterModel = {}
            dispatch(fetchStocks({ filterStock: filterStock }));

            const res : IReturnMessage<IStockViewModel> = await dispatch(fetchStocksOptions()).unwrap();

            setLogisticsStuffs(res.value.logisticStuffs);
        }

        fetchData();

    }, [dispatch]);



    return (
        <>
            <div>
                <FormAddStock logisticsStuffOptions={logisticsStuffs}/>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={stocks}
                    hasHeaderNumberOfRows={true}
                    contentHeaderNumberOfRows={"Total"}
                />
            </div>
        </>);
}