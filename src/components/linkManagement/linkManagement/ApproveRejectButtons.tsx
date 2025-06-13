import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms, managementHealthProfessionalByProgramDoctorByProgram } from "@/store/slices/linkManagementeSlice";
import { fetchPendings } from "@/store/slices/pendingsSlice";
import { useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { LuGalleryHorizontal } from "react-icons/lu";

type ApproveReproveButtonsProps = {
  id: string;
  typeRender?: TypeRender;
};

type TypeRender = "dataTable" | "modalPending";

const ApproveRejectButtons = ({ id, typeRender = "dataTable" }: ApproveReproveButtonsProps) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [handleConfirm, setHandleConfirm] = useState<() => void>(() => () => { });

  const loading = useAppSelector((state) => state.linkManagement.loading);

  const { show, hide } = useLoading();

  useEffect(() => {

    if (loading)
      show()
    else
      hide()

  }, [loading]);

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
      setIsDialogOpen(false);
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
        if(typeRender == "dataTable")
          dispatch(fetchHealthProfessionalByProgramDoctorByPrograms())
        else if(typeRender == "modalPending")
          dispatch(fetchPendings())
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
      {typeRender === "dataTable" &&
        <div className="flex justify-start gap-4 px-2">
          <button onClick={() => handleClick("#ACTV")} className="text-green-600 hover:text-green-800">
            <HiCheck size={20} />
          </button>
          <button onClick={() => handleClick("#REJECTED")} className="text-red-600 hover:text-red-800">
            <HiX size={20} />
          </button>
        </div>
      }
      {
        typeRender === "modalPending" && 
        <div className="flex flex-row w-full justify-between gap-4">
          <Button className="basis-1/2" variant={"outlineMainlilly"} size={"lg"} onClick={() => handleClick("#REJECTED")}>Reprovar</Button>
          <Button className="basis-1/2" value={"Aprovar"} size={"lg"} onClick={() => handleClick("#ACTV")}>Aprovar</Button>
        </div>
      }
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