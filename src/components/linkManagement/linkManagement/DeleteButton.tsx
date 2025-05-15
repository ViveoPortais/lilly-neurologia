import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector} from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms, managementHealthProfessionalByProgramDoctorByProgram } from "@/store/slices/linkManagementeSlice";
import { useEffect, useState } from "react";

type DeleteButtonProps = {
  id: string;
  statusCode?: string;
};

const DeleteButton = ({ id, statusCode = "#IACTV" }: DeleteButtonProps) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loading = useAppSelector((state) => state.linkManagement.loading);

  const {show,hide} = useLoading();

  useEffect(()=>{

      if(loading)
          show()
      else
          hide()

  },[loading]);
    
  const modal = useGenericModal();

  const dispatch = useAppDispatch();

  const handleOnClickDelete = async () => {
    setIsDialogOpen(true);
  }

  const handleOnConfirm = async () => {

    const result = await dispatch(managementHealthProfessionalByProgramDoctorByProgram({ id: id, statusCode: statusCode })).unwrap();

    if (result) {
      if (result.isValidData) {
        modal.showModal(
          {
            type: "success",
            title: "Sucesso",
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
            title: "Erro",
            buttonLabel: "Fechar",
            message: result.additionalMessage
          },
          () => { }
        )
      }
    }
  }

  return (
    <>
    <div className="flex justify-start gap-4 px-2">
      <button
        onClick={handleOnClickDelete}
        className="px-3 py-1 border border-red-500 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50"
      >
        Excluir
      </button>
    </div>
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleOnConfirm}
        content={`Tem certeza que deseja excluir o vínculo?`}
      />
    </>
  );
};

export default DeleteButton;