import { ISchedulingHistoryResultModel } from "@/types/diagnostic";
import dayjs from "dayjs";

type HistoryDetailsProps = {
    schedulingHistory : ISchedulingHistoryResultModel[]
};

const HistoryDetails = ({ schedulingHistory}: HistoryDetailsProps) => {

    return (
        <>
            <div className="border border-gray-400 rounded rounded-2xl p-4 w-full">
                <h1 className="text-2xl text-left mb-10">Histórico</h1>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full md:w-[70%] text-left mx-auto">
                        <thead className="text-gray-500 text-xs md:text-base">
                            <tr className="flex flex-row justify-between">
                                <th className="basis-1/3">Histórico de ações</th>
                                <th className="basis-1/3">Data do Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm/8 md:text-lg/10">
                            {schedulingHistory.map((item : ISchedulingHistoryResultModel) => (
                                <tr key={item.id} className="flex flex-row justify-between">
                                    <td className="text-gray-700 basis-1/3"><span>{item.statusName}</span></td>
                                    <td className="text-gray-700 basis-1/3">{dayjs(item.requestDate).format("DD/MM - HH:mm:ss")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default HistoryDetails;