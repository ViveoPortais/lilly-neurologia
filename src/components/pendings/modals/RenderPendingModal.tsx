import { ExamPendingModel } from "@/types/diagnostic";
import { formatFileSize } from "@/helpers/helpers";
import GenericModalForm from "@/components/modals/GenericModalForm";
import OperationRejectedDocModal from "./OperationRejectedDocModal";
import RejectedDocModal from "./RejectedDocModal";
import OperationGenerateDeclarationModal from "./OperationGenerateDeclarationModal";
import TubeShippingModal from "./TubeShippingModal";
import TubeDeliveryDate from "./TubeDeliveryDate";
import RedirectToScheduleSample from "@/components/scheduleSample/RedirectToScheduleSample";

interface RenderPendingModalProps {
 item: ExamPendingModel | null;
 onClose: () => void;
 category: string;
 role: string;
}

type Role = "doctor" | "operation" | "logistics";
type Category =
 | "Documentação"
 | "Solicitações de Retirada de Amostra"
 | "Problema com a Amostra"
 | "Aprovação de Vínculo"
 | "Gerar declaração de Lote"
 | "Confirma Entrega de Amostra"
 | "Concluir Análise"
 | "Solicitações de Envio de Tubo"
 | "Confirma Entrega de Tubo"
 | "Solicitações de Retirada"
 | "Confirmar Retirada da Amostra";

type ModalRenderer = (item: ExamPendingModel, onClose: () => void) => JSX.Element;

const modalMapByRole: Record<Role, Partial<Record<Category, ModalRenderer>>> = {
 doctor: {
  Documentação: (item, onClose) => <RejectedDocModal open onClose={onClose} item={item} />,
  "Solicitações de Retirada de Amostra": (item) => <RedirectToScheduleSample item={item} />,
 },
 operation: {
  Documentação: (item, onClose) => (
   <GenericModalForm title="Avaliar Documentos" isOpen onClose={onClose}>
    <OperationRejectedDocModal onClose={onClose} item={item} />
   </GenericModalForm>
  ),
  "Gerar declaração de Lote": (item, onClose) => (
   <GenericModalForm title="Declaração" isOpen onClose={onClose}>
    <OperationGenerateDeclarationModal onClose={onClose} />
   </GenericModalForm>
  ),
 },
 logistics: {
  "Solicitações de Envio de Tubo": (item, onClose) => (
   <GenericModalForm title="Envio de tubo" isOpen onClose={onClose}>
    <TubeShippingModal onClose={onClose} item={item} />
   </GenericModalForm>
  ),
  "Confirma Entrega de Tubo": (item, onClose) => (
   <GenericModalForm title="Data da Entrega" isOpen onClose={onClose}>
    <TubeDeliveryDate onClose={onClose} item={item} />
   </GenericModalForm>
  ),
 },
};

export function RenderPendingModal({ item, onClose, category, role }: RenderPendingModalProps) {
 if (!item) return null;

 const byRole = modalMapByRole[role as Role];
 if (!byRole) return null;

 const renderFn = byRole[category as Category];
 if (!renderFn) return null;

 return renderFn(item, onClose);
}