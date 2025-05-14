import { useGenericModal } from "@/contexts/GenericModalContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms, managementHealthProfessionalByProgramDoctorByProgram } from "@/store/slices/linkManagementeSlice";
import { IReturnMessage } from "@/types/general";
import { useEffect } from "react";
import { HiCheck, HiX } from "react-icons/hi";

type ApproveReproveButtonsProps = {
  id: string;
};

const ApproveRejectButtons = ({ id }: ApproveReproveButtonsProps) => {

  const modal = useGenericModal();

  const dispatch = useAppDispatch();

  const resultManagementNurses = useAppSelector((state) => state.linkManagement.data.resultManagementNurses);

  const handleClick = async (statusCode: string) => {
    dispatch(managementHealthProfessionalByProgramDoctorByProgram({ id: id, statusCode: statusCode }));
  }

  useEffect(() => {

    const result = resultManagementNurses as IReturnMessage;

    if (result) {
      if (result.isValidData) {
        modal.showModal(
          {
            type: "success",
            title: "Vínculo atualizado com sucesso",
            buttonLabel: "Fechar",
            message: result.additionalMessage
          },
          () => { }
        )
        dispatch(fetchHealthProfessionalByProgramDoctorByPrograms())
      }
      else {
        modal.showModal(
          {
            type: "error",
            title: "Vínculo atualizado com sucesso",
            buttonLabel: "Fechar",
            message: result.additionalMessage
          },
          () => { }
        )
      }
    }
  }, [resultManagementNurses]);

  return (
    <div className="flex justify-center gap-2">
      <button onClick={() => handleClick("#ACTV")} className="text-green-600 hover:text-green-800">
        <HiCheck size={20} />
      </button>
      <button onClick={() => handleClick("#REJECTED")} className="text-red-600 hover:text-red-800">
        <HiX size={20} />
      </button>
    </div>
  );
};

export default ApproveRejectButtons;