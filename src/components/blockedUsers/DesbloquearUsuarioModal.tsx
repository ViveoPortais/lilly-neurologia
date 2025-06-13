import GenericModalForm from "@/components/modals/GenericModalForm";
import { Button } from "@/components/ui/button";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { BlockedUser } from "./columnsBlockedUsers";

interface Props {
  user: BlockedUser;
  onClose: () => void;
}

export default function DesbloquearUsuarioModal({ user, onClose }: Props) {
  const { showModal } = useGenericModal();

  const handleUnlock = () => {
    // TODO: chamada de desbloqueio via API
    const sucesso = true;

    onClose();

    if (sucesso) {
      showModal({
        type: "success",
        message: "Usuário desbloqueado com sucesso!",
      });
    } else {
      showModal({
        type: "error",
        message: "Erro ao desbloquear usuário",
      });
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