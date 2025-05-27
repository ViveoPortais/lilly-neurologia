import { IStringMap } from "@/types";
import CircleStatusCustom from "./CircleStatusCustom";

type StatusCustomProps = {
    type: string;
    statusStringMap?: IStringMap| undefined | null;
};

const StatusCustom = ({ type, statusStringMap }: StatusCustomProps) => {

    let color = "";

    if (statusStringMap && type === 'ExamStatusStringMap') {
        switch (statusStringMap.flag) {
            case "EXAM_PENDING_SIGNATURE_DOCUMENTATION":
            case "EXAM_DOCUMENTATION_APROVATION":
            case "EXAM_WITHDRAWAL_WAITING_APROVATION":
                color = "bg-yellow-400";
                break;
            case "EXAM_CANCELED":
                color = "bg-black";
            case "EXAM_DOCUMENTATION_REPROVED":
            case "EXAM_SCHEDULE_DISAPROVED":
            case "EXAM_PROBLEM_WITH_SAMPLE":
                color = "bg-red-600";
                break;
            case "EXAM_WAITING_TUBE":
            case "EXAM_WAITING_WITHDRAWAL":
                color = "bg-blue-500";
                break;
            case "EXAM_TUBE_IN_TRANSIT":
            case "EXAM_SAMPLE_IN_TRANSIT":
                color = "bg-purple-600";
                break;
            case "EXAM_WAITING_LOGISTICS_BATCH":
            case "EXAM_WAITING_SCHEDULE_WITHDRAWAL":
                color = "bg-orange-500";
                break;
            case "EXAM_REPORT_AVAILABLE":
                color = "bg-green-500";
                break;
            case "EXAM_IN_ANALYSIS":
                color = "bg-gray-300";
                break;
        }
    }

    if (statusStringMap && type === 'StatusCodeLink') {
        switch (statusStringMap.flag) {
            case "#PENDENT":
                color = "bg-yellow-400";
                break;
            case "#IACTV":
            case "#REJECTED":
                color = "bg-red-600"
                break;
            case "#ACTV":
                color = "bg-green-500"
                break;
        }

    }



    return (
        <div className="flex items-center gap-2">
            <CircleStatusCustom color={color} />
            <span>{statusStringMap?.optionName}</span>
        </div>
    );
};

export default StatusCustom;