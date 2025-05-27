"use client";

import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import PatientForm from "@/components/registerPatient/PatientForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getLinkedDoctor } from "@/store/slices/registerPatientSlice";
import { useEffect, useState } from "react";

export default function RegisterPatientProfessionalPage() {
 const isMobile = useMediaQuery("(max-width: 768px)");
 const role = useSession();
 const dispatch = useAppDispatch();
 const linkedDoctor = useAppSelector((state) => state.registerPatient.data.linkedDoctor);
 const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

 useEffect(() => {
  dispatch(getLinkedDoctor());
 }, []);

 return (
  <div className="space-y-8 pb-12 md:pb-2">
   <CustomFilterSelect
    name="linkedDoctor"
    label="Escolher Médico"
    options={linkedDoctor!}
    value={selectedDoctorId}
    onChange={setSelectedDoctorId}
    customClass="w-full md:max-w-md"
   />

   {selectedDoctorId && <PatientForm role={role.role} isMobile={isMobile} doctor={selectedDoctorId} />}
  </div>
 );
}
