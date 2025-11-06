"use client";
import { IDiagnosticExamModel } from "@/types/diagnostic";
import dayjs from "dayjs";
import StatusCustom from "../custom/StatusCustom";
import { getCategoryFromFlag, resolvableFlags } from "@/helpers/resolveHelper";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedDoctorId } from "@/store/slices/registerPatientSlice";
import { IStringMap } from "@/types";
import { FaCircleExclamation, FaChevronDown, FaChevronUp, FaPaperPlane, FaStumbleupon, FaVial } from "react-icons/fa6";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AddressesDetailsProps = {
  data: IDiagnosticExamModel;
};

const AddressesDetails = ({ data}: AddressesDetailsProps) => {
  const router = useRouter();
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [pickupOpen, setPickupOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 text-left">
        <div className="basis-[100%] contentDetails">
          <button
            onClick={() => setDeliveryOpen(!deliveryOpen)}
            className="w-full flex justify-between items-center text-left mb-4 pe-6"
          >
            <div className="flex items-center gap-4">
              <h1>Endereço de Entrega do Tubo </h1>
              <FaPaperPlane size={20} className="text-mainlilly mb-4"/>
            </div>
            {deliveryOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <AnimatePresence>
            {deliveryOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col md:flex-row gap-6 py-2">
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Endereço Comercial</label>
                    <p className="truncate" title={data.addressCommercial ? "Sim" : "Não"}>{data.addressCommercial ? "Sim" : "Não"}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">CEP</label>
                    <p className="truncate" title={data.addressPostalCode || undefined}>{data.addressPostalCode}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Rua</label>
                    <p className="truncate" title={data.addressName || undefined}>{data.addressName}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Número</label>
                    <p className="truncate" title={data.addressNumber || undefined}>{data.addressNumber}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Complemento/Sala/Consultório</label>
                    <p className="truncate" title={data.addressComplement || undefined}>{data.addressComplement}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 py-2">
                  <div className="md:basis-1/6 min-w-0">
                    <label className="block text-sm font-medium mb-1">Bairro</label>
                    <p className="truncate" title={data.addressDistrict || undefined}>{data.addressDistrict}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <p className="truncate" title={data.addressCity || undefined}>{data.addressCity}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <p className="truncate" title={data.addressState || undefined}>{data.addressState}</p>
                  </div>
                </div>
                { data.addressCommercial &&
                <div className="flex flex-col md:flex-row gap-6 py-4">
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Nome do Responsável</label>
                    <p className="truncate" title={data.deliveryTubeContact || undefined}>{data.deliveryTubeContact}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Telefone de Contato</label>
                    <p className="truncate" title={data.deliveryTubeTelephone || undefined}>{data.deliveryTubeTelephone}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Nome do Local</label>
                    <p className="truncate" title={data.logisticsLocal?.name || undefined}>{data.logisticsLocal?.name}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">CNPJ</label>
                    <p className="truncate" title={data.logisticsLocal?.cnpj || undefined}>{data.logisticsLocal?.cnpj}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Razão Social</label>
                    <p className="truncate" title={data.logisticsLocal?.companyName || undefined}>{data.logisticsLocal?.companyName}</p>
                  </div>
                </div>
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-10 text-left">
        <div className="basis-[100%] contentDetails">
          <button
            onClick={() => setPickupOpen(!pickupOpen)}
            className="w-full flex justify-between items-center text-left mb-4 pe-6"
          >
            <div className="flex items-center gap-4">
              <h1>Endereço de Retirada da Amostra </h1>
              <FaVial size={20} className="text-mainlilly mb-4"/>
            </div>
            {pickupOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <AnimatePresence>
            {pickupOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col md:flex-row gap-6 py-2">
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Endereço Comercial</label>
                    <p className="truncate" title={data.logisticsAddressCommercial ? "Sim" : "Não"}>{data.logisticsAddressCommercial ? "Sim" : "Não"}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">CEP</label>
                    <p className="truncate" title={data.logisticsAddressPostalCode || undefined}>{data.logisticsAddressPostalCode}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Rua</label>
                    <p className="truncate" title={data.logisticsAddressName || undefined}>{data.logisticsAddressName}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Número</label>
                    <p className="truncate" title={data.logisticsAddressNumber || undefined}>{data.logisticsAddressNumber}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Complemento/Sala/Consultório</label>
                    <p className="truncate" title={data.logisticsAddressComplement || undefined}>{data.logisticsAddressComplement}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 py-2">
                  <div className="md:basis-1/6 min-w-0">
                    <label className="block text-sm font-medium mb-1">Bairro</label>
                    <p className="truncate" title={data.logisticsAddressDistrict || undefined}>{data.logisticsAddressDistrict}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <p className="truncate" title={data.logisticsAddressCity || undefined}>{data.logisticsAddressCity}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <p className="truncate" title={data.logisticsAddressState || undefined}>{data.logisticsAddressState}</p>
                  </div>
                </div>
                { data.logisticsAddressCommercial &&
                <div className="flex flex-col md:flex-row gap-6 py-4">
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Nome do Responsável</label>
                    <p className="truncate" title={data.section || undefined}>{data.section}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Telefone de Contato</label>
                    <p className="truncate" title={data.institutionTelephone || undefined}>{data.institutionTelephone}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Nome do Local</label>
                    <p className="truncate" title={data.logisticsScheduleLocal?.name || undefined}>{data.logisticsScheduleLocal?.name}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">CNPJ</label>
                    <p className="truncate" title={data.logisticsScheduleLocal?.cnpj || undefined}>{data.logisticsScheduleLocal?.cnpj}</p>
                  </div>
                  <div className="md:basis-1/5 min-w-0">
                    <label className="block text-sm font-medium mb-1">Razão Social</label>
                    <p className="truncate" title={data.logisticsScheduleLocal?.companyName || undefined}>{data.logisticsScheduleLocal?.companyName}</p>
                  </div>
                </div>
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default AddressesDetails;