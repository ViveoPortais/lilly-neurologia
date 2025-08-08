import { useState } from "react";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import DiagnosticDetails from "./DiagnosticDetails";
import AttachmentDetails from "./AttachmentDetails";
import HistoryDetails from "./HistoryDetails";
import { Button } from "../ui/button";
import { FaCircleExclamation } from "react-icons/fa6";
import { IDiagnosticExamModel, IRequestSignModel } from "@/types/diagnostic";
import { IAnnotationModel } from "@/types/general";
import GenericModalForm from "../modals/GenericModalForm";
import FormCancelDiagnostic from "./FormCancelDiagnostic";
import { IStringMap } from "@/types";
import MatrixAccess from "./MatrixAccess";
import useSession from "@/hooks/useSession";
import LabelDownload from "./LabelDownload";
import DigitalSignatureDetails from "./DigitalSignatureDetails";

interface ModalDiagnosticDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: IDiagnosticExamModel | undefined;
  annotations: IAnnotationModel[];
  optionsCancellation: IStringMap[];
  digitalSignatureDetails : IRequestSignModel | null;
}

export default function ModalDiagnosticDetails({ isOpen, onClose, data, annotations, optionsCancellation , digitalSignatureDetails}: ModalDiagnosticDetailsFormProps) {
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);

  const auth = useSession();

  const handleCancelProtocol = async () => {
    setIsOpenCancelModal(true);
  };

  return (
    <>
      {isOpen && data && (
        <div className={`fixed inset-0 bg-black/30 flex ${auth.role === "logistics" ? "sm:items-center" : ""} justify-center z-50 md:py-5`}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl pt-8 pb-4 pl-6 pr-6 shadow-lg w-full text-center w-full md:max-w-[50%] overflow-y-auto scrollbar-hidden overflow-x-none pb-10"
          >
            <div className="flex flex-row-reverse pb-2 mb-4">
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-black border-2 bg-white hover:bg-gray-100 transition duration-200"
                aria-label="Fechar"
              >
                <HiX className="text-black text-base font-bold" />
              </button>
            </div>
            <DiagnosticDetails data={data} role={auth.role} />
            {auth.role !== "logistics" && (
              <div className="flex flex-col w-full space-y-8 mt-2">
                {auth.role === "doctor" && (data.examStatusStringMap?.optionName == "Laudo Disponível") && <MatrixAccess data={data} />}
                {annotations.length > 0 && <AttachmentDetails annotations={annotations} />}
                {data.hasDigitalSignature && <DigitalSignatureDetails data={digitalSignatureDetails}/>}
                {auth.role === "operation" && data.labelAttachment?.[0] && <LabelDownload file={data.labelAttachment?.[0]!}/>}
                <HistoryDetails schedulingHistory={data.schedulingHistory ?? []} />
                {!(data.examStatusStringMap?.flag == "EXAM_CANCELED" || data.examStatusStringMap?.flag == "EXAM_REPORT_AVAILABLE") && (
                  <div>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-l-8 w-full border-l-mainlilly rounded-2xl pl-3 pr-4 py-4 shadow-sm gap-4">
                      <div className="flex flex-row">
                        <FaCircleExclamation size={30} className="text-red-200 bg-mainlilly rounded rounded-full" />
                        <p className="text-base md:text-xl text-gray-800 px-4">Deseja Cancelar a Solicitação?</p>
                      </div>
                      <Button className="ml-4 px-10 py-2 font-semibold text-base" onClick={() => handleCancelProtocol()}>
                        Cancelar Solicitação
                      </Button>
                      <GenericModalForm title="Cancelar Solicitação" isOpen={isOpenCancelModal} onClose={() => setIsOpenCancelModal(false)}>
                        <FormCancelDiagnostic
                          onClose={() => {
                            setIsOpenCancelModal(false);
                            onClose();
                          }}
                          options={optionsCancellation}
                        />
                      </GenericModalForm>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}