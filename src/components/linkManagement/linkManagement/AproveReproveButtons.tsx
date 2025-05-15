import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms, managementHealthProfessionalByProgramDoctorByProgram } from "@/store/slices/linkManagementeSlice";
import {useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";

type ApproveReproveButtonsProps = {
  id: string;
};

const ApproveRejectButtons = ({ id }: ApproveReproveButtonsProps) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [handleConfirm, setHandleConfirm] = useState<() => void>(() => () => { });

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

  const handleClick = async (statusCode: string) => {
    setContent(
      statusCode == "#ACTV" ?
        "Tem certeza que deseja aprovar o vínculo?" :
        "Tem certeza que deseja reprovar o vínculo?"
    );

    setHandleConfirm(() => () => {
      handleOnConfirm(statusCode);
    });

    setIsDialogOpen(true);
  }

  const handleOnConfirm = async (statusCode: string) => {
    
    const response = await dispatch(managementHealthProfessionalByProgramDoctorByProgram({ id: id, statusCode: statusCode }));

    const result = response.payload;

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
        <button onClick={() => handleClick("#ACTV")} className="text-green-600 hover:text-green-800">
          <HiCheck size={20} />
        </button>
        <button onClick={() => handleClick("#REJECTED")} className="text-red-600 hover:text-red-800">
          <HiX size={20} />
        </button>
      </div>
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        content={content}
      />
    </>
  );
};

export default ApproveRejectButtons;