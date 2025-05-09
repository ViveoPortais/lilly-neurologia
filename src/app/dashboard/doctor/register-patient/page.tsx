"use client";

import PatientForm from "@/components/registerPatient/PatientForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import useSession from "@/hooks/useSession";
import { IStringMap } from "@/types";
import { useEffect, useState } from "react";

export default function RegisterPatientDoctorPage() {
 const isMobile = useMediaQuery("(max-width: 768px)");
 const role = useSession();
 const [selectedDoctorId, setSelectedDoctorId] = useState<string>();
 const [doctors, setDoctors] = useState<IStringMap[]>([]);
 const [loading, setLoading] = useState(false);

//  useEffect(() => {
//   if (role.role !== "doctor") {
//    setLoading(true);
//    fetchDoctors()
//     .then((response) => {
//      const transformed = response.map((d: any) => ({
//       stringMapId: d.id,
//       optionName: d.name,
//      }));
//      setDoctors(transformed);
//     })
//     .finally(() => setLoading(false));
//   }
//  }, [role]);

 return <PatientForm role={role.role} isMobile={isMobile} />;
}
