"use client";

import PatientForm from "@/components/registerPatient/PatientForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import useSession from "@/hooks/useSession";

export default function RegisterPatientDoctorPage() {
 const isMobile = useMediaQuery("(max-width: 768px)");
 const role = useSession();

 return <PatientForm role={role.role} isMobile={isMobile} />;
}
