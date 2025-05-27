import { useAppDispatch } from "@/store/hooks";
import { examResolvePendency } from "@/store/slices/pendingsSlice";
import { ExamPendingModel } from "@/types/diagnostic";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";

interface ResolvePendencyParams {
 item: ExamPendingModel;
 onSuccess?: () => void;
}

export function useResolveExamPendency() {
 const dispatch = useAppDispatch();
 const { showModal } = useGenericModal();
 const { show, hide } = useLoading();

 const resolve = async ({ item, onSuccess }: ResolvePendencyParams) => {
  show();

  try {
   const response = await dispatch(
    examResolvePendency({
     ...item,
    } as ExamPendingModel)
   );

   if (examResolvePendency.fulfilled.match(response)) {
    const payload = response.payload;
    if (payload.isValidData) {
     showModal(
      {
       type: "success",
       message: payload.additionalMessage ?? "Pendência resolvida com sucesso.",
      },
      onSuccess
     );
    } else {
     showModal({
      type: "warning",
      message: payload.additionalMessage ?? "Não foi possível salvar as decisões.",
     });
    }
   } else {
    showModal({
     type: "error",
     message: "Erro ao resolver pendência.",
    });
   }
  } catch {
   showModal({
    type: "error",
    message: "Erro inesperado ao tentar salvar.",
   });
  } finally {
   hide();
  }
 };

 return { resolve };
}