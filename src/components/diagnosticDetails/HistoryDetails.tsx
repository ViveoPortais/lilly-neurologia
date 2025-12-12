import { ISchedulingHistoryResultModel } from "@/types/diagnostic";
import dayjs from "dayjs";
import { Checkbox } from "../ui/checkbox";

type HistoryDetailsProps = {
  schedulingHistory: ISchedulingHistoryResultModel[];
};

const HistoryDetails = ({ schedulingHistory }: HistoryDetailsProps) => {
  return (
    <>
      <div className="border border-gray-400 rounded rounded-2xl p-4 w-full">
        <h1 className="text-base md:text-2xl text-left">Histórico</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full md:w-[70%] text-left mx-auto">
            <thead className="text-gray-500 text-xs md:text-base">
              <tr className="flex flex-row justify-between">
                <th className="basis-1/3">Histórico de ações</th>
                <th className="basis-1/3">Data do Status</th>
              </tr>
            </thead>
            <tbody className="text-sm/8 md:text-lg/10">
              {schedulingHistory.map((item: ISchedulingHistoryResultModel) => (
                <tr key={item.id} className="flex flex-row justify-between items-center">
                  <td className="text-gray-700 basis-1/3 flex items-center gap-2 min-w-[60%]">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => {}}
                      className="border border-[#82786F] data-[state=checked]:bg-white data-[state=checked]:text-[#82786F]"
                    />
                    <span className="truncate" title={item.statusName ?? item.description}>{item.statusName ?? item.description}</span>
                  </td>
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