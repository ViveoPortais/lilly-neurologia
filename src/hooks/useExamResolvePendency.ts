import { useAppDispatch } from "@/store/hooks";
import { examResolvePendency, fetchPendings } from "@/store/slices/pendingsSlice";
import { ExamPendingModel } from "@/types/diagnostic";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import useSession from "./useSession";

interface ResolvePendencyParams {
 item: ExamPendingModel;
 onSuccess?: () => void;
}

export function useResolveExamPendency() {
 const dispatch = useAppDispatch();
 const { showModal } = useGenericModal();
 const { show, hide } = useLoading();
 const router = useRouter();
 const auth = useSession();

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
     const role = auth.role;
     showModal(
      {
       type: "success",
       message: payload.additionalMessage ?? "Pendência resolvida com sucesso.",
      },
      () => {
       onSuccess?.();
       window.location.reload();
      }
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