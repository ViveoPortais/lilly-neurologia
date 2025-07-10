"use client";

import { Button } from "@/components/ui/button";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import useSession from "@/hooks/useSession";
import { useAppDispatch } from "@/store/hooks";
import { unblockUserById } from "@/store/slices/blockedUserSlice";
import { IBlockedUser } from "@/types/user";

interface Props {
  user: IBlockedUser;
  onClose: () => void;
}

export default function DesbloquearUsuarioModal({ user, onClose }: Props) {
  const { showModal } = useGenericModal();
  const { show, hide } = useLoading();
  const dispatch = useAppDispatch();
  const auth = useSession();

  const handleUnlock = async () => {
    show();
    try {
      await dispatch(
        unblockUserById({
          userId: user.id,
          programCode: auth.programsCode[0],
        })
      ).unwrap();

      showModal({
        type: "success",
        message: "Usuário desbloqueado com sucesso!",
      });
    } catch (err) {
      showModal({
        type: "error",
        message: "Erro ao desbloquear usuário",
      });
    } finally {
      hide();
      onClose();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Deseja desbloquear este usuário?</p>
      <div className="flex gap-4">
        <Button variant="outlineMainlilly" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="default" onClick={handleUnlock}>
          Desbloquear
        </Button>
      </div>
    </div>
  );
}