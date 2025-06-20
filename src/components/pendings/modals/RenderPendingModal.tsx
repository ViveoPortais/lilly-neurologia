import { ExamPendingModel } from "@/types/diagnostic";
import { formatFileSize } from "@/helpers/helpers";
import GenericModalForm from "@/components/modals/GenericModalForm";
import OperationRejectedDocModal from "./OperationRejectedDocModal";
import RejectedDocModal from "./RejectedDocModal";
import OperationGenerateDeclarationModal from "./OperationGenerateDeclarationModal";
import TubeShippingModal from "./TubeShippingModal";
import TubeDeliveryDate from "./TubeDeliveryDate";
import RedirectToScheduleSample from "@/components/scheduleSample/RedirectToScheduleSample";
import AnalysisConclusionModal from "./AnalysisConclusionModal";
import DeliverySampleModal from "./DeliverySampleModal";
import ApproveRejectButtons from "@/components/linkManagement/linkManagement/ApproveRejectButtons";
import SampleIssueModal from "../doctor/SampleIssueModal";
import ApproveSampleDateModal from "../logistic/ApproveSampleDateModal";
import RejectedScheduleModal from "./RejectedScheduleModal";

interface RenderPendingModalProps {
  item: ExamPendingModel | null;
  onClose: () => void;
  category: string;
  role: string;
}

type Role = "doctor" | "operation" | "logistics" | "professional";
type Category =
  | "Documentação"
  | "Solicitações de Retirada de Amostra"
  | "Problema com a Amostra"
  | "Aprovação de Vínculo"
  | "Gerar Declaração de Lote"
  | "Confirmar Entrega de Amostra"
  | "Concluir Análise"
  | "Solicitações de Envio de Tubo"
  | "Confirmar Entrega de Tubo"
  | "Solicitações de Retirada"
  | "Confirmar Retirada da Amostra";

type ModalRenderer = (item: ExamPendingModel, onClose: () => void) => JSX.Element;

const modalMapByRole: Record<Role, Partial<Record<Category, ModalRenderer>>> = {
  doctor: {
    Documentação: (item, onClose) => <RejectedDocModal open onClose={onClose} item={item} />,
    "Solicitações de Retirada de Amostra": (item, onClose) => {
      if (item.reason === "Agendamento de retirada reprovado") {
        return (
          <GenericModalForm title="Retirada da Amostra" isOpen={true} onClose={onClose}>
            <RejectedScheduleModal item={item} onClose={onClose} />
          </GenericModalForm>
        );
      }
      return <RedirectToScheduleSample item={item} />;
    },
    "Aprovação de Vínculo": (item, onClose) => (
      <GenericModalForm size={"sm"} title="Aprovação de Vínculo" isOpen={true} onClose={onClose}>
        <ApproveRejectButtons id={item.id} typeRender="modalPending" />
      </GenericModalForm>
    ),
    "Problema com a Amostra": (item, onClose) => <SampleIssueModal item={item} onClose={onClose} />,
  },
  operation: {
    Documentação: (item, onClose) => (
      <GenericModalForm title="Avaliar Documentos" isOpen onClose={onClose}>
        <OperationRejectedDocModal onClose={onClose} item={item} />
      </GenericModalForm>
    ),
    "Gerar Declaração de Lote": (item, onClose) => (
      <GenericModalForm title="Declaração" isOpen onClose={onClose}>
        <OperationGenerateDeclarationModal item={item} onClose={onClose} />
      </GenericModalForm>
    ),
    "Concluir Análise": (item, onClose) => <AnalysisConclusionModal onClose={onClose} item={item} />,
    "Confirmar Entrega de Amostra": (item, onClose) => (
      <GenericModalForm title="Entrega de Amostra" isOpen onClose={onClose}>
        <DeliverySampleModal onClose={onClose} item={item} />
      </GenericModalForm>
    ),
  },
  logistics: {
    "Solicitações de Envio de Tubo": (item, onClose) => (
      <GenericModalForm title="Envio de tubo" isOpen onClose={onClose}>
        <TubeShippingModal onClose={onClose} item={item} />
      </GenericModalForm>
    ),
    "Confirmar Entrega de Tubo": (item, onClose) => (
      <GenericModalForm title="Data da Entrega" isOpen onClose={onClose}>
        <TubeDeliveryDate onClose={onClose} item={item} />
      </GenericModalForm>
    ),
    "Confirmar Retirada da Amostra": (item, onClose) => (
      <GenericModalForm title="Amostra Retirada" isOpen onClose={onClose}>
        <DeliverySampleModal onClose={onClose} item={item} />
      </GenericModalForm>
    ),
    "Solicitações de Retirada": (item, onClose) => <ApproveSampleDateModal item={item} onClose={onClose} />,
  },
  professional: {
    Documentação: (item, onClose) => <RejectedDocModal open onClose={onClose} item={item} />,
    "Solicitações de Retirada de Amostra": (item, onClose) => {
      if (item.reason === "Agendamento Reprovado") {
        <GenericModalForm title="Retirada da Amostra" isOpen={true} onClose={onClose}>
          <RejectedScheduleModal item={item} onClose={onClose} />;
        </GenericModalForm>;
      }
      return <RedirectToScheduleSample item={item} />;
    },
    "Problema com a Amostra": (item, onClose) => <SampleIssueModal item={item} onClose={onClose} />,
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