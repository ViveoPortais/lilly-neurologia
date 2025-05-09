import { HiCheck, HiX } from "react-icons/hi";

type ApproveReproveButtonsProps = {
  onApprove?: () => void;
  onReject?: () => void;
};

const ApproveRejectButtons = ({ onApprove, onReject }: ApproveReproveButtonsProps) => {
  return (
    <div className="flex justify-center gap-2">
      <button onClick={onApprove} className="text-green-600 hover:text-green-800">
        <HiCheck size={20} />
      </button>
      <button onClick={onReject} className="text-red-600 hover:text-red-800">
        <HiX size={20} />
      </button>
    </div>
  );
};

export default ApproveRejectButtons;