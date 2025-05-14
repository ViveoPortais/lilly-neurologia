import { useGenericModal } from "@/contexts/GenericModalContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms, managementHealthProfessionalByProgramDoctorByProgram } from "@/store/slices/linkManagementeSlice";
import { IReturnMessage } from "@/types/general";
import { useEffect } from "react";

type DeleteButtonProps = {
  id: string;
  statusCode?: string;
};

const DeleteButton = ({ id, statusCode = "#IACTV" }: DeleteButtonProps) => {

  const modal = useGenericModal();

  const dispatch = useAppDispatch();

  const resultManagementNurses = useAppSelector((state) => state.linkManagement.data.resultManagementNurses);

  const handleOnClickDelete = async () => {
    dispatch(managementHealthProfessionalByProgramDoctorByProgram({ id: id, statusCode: statusCode }));
  }

  useEffect(() => {

    const result = resultManagementNurses as IReturnMessage;

    if (result) {
      if (result.isValidData) {
        modal.showModal(
          {
            type : "success",
            title: "Vínculo atualizado com sucesso",
            buttonLabel : "Fechar",
            message : result.additionalMessage
          },
          () =>{}
        )
        dispatch(fetchHealthProfessionalByProgramDoctorByPrograms())
      }
      else {
        modal.showModal(
          {
            type: "error",
            title: "Falha ao atualizar vínculo",
            buttonLabel: "Fechar",
            message: result.additionalMessage
          },
          () => { }
        )
      }
    }
  }, [resultManagementNurses]);

  return (
    <button
      onClick={handleOnClickDelete}
      className="px-3 py-1 border border-red-500 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50"
    >
      Excluir
    </button>
  );
};

export default DeleteButton;