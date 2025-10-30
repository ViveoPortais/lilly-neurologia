"use client";

import { DataTable } from "@/components/dashboard/DataTable";
import { useEffect, useMemo, useState } from "react";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms } from "@/store/slices/linkManagementeSlice";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchMyDiagnostics } from "@/store/slices/diagnosticSlice";
import { IDiagnosticFilterModel } from "@/types/diagnostic";
import Filter from "./Filter";
import { IStringMap } from "@/types";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { getLinkedDoctor } from "@/store/slices/registerPatientSlice";
import { columns } from "./columns";
import { columnsLogistics } from "./columnsLogistics";
import { Button } from "../ui/button";
import { exportDiagnosticsToExcel } from "@/utils/exportExcel";

export default function MyRequests() {
  const dispatch = useAppDispatch();
  const myExams = useAppSelector((state) => state.diagnostic.data.myExams);
  const loading = useAppSelector((state) => state.diagnostic.loading);
  const [stringMapsFilter, setStringMapsFilter] = useState<IStringMap[]>([]);
  const linkedDoctor = useAppSelector((state) => state.registerPatient.data.linkedDoctor);
  const session = useSession();

  const { show, hide } = useLoading();

  useEffect(() => {
    if (loading) show();
    else hide();
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      const filterDiagnostic: IDiagnosticFilterModel = {};
      dispatch(fetchMyDiagnostics({ filterDiagnostic: filterDiagnostic }));

      const examStatusStringMaps = await dispatch(fetchStringMaps({ entityName: "Exam", attributeName: "ExamStatusStringMap" })).unwrap();
      setStringMapsFilter(examStatusStringMaps);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (session.role === "professional") dispatch(getLinkedDoctor());
  }, [session.role]);

  return (
    <>
      <div>
        <Filter stringMapsFilter={stringMapsFilter} linkedDoctor={linkedDoctor ?? []} />
      </div>

      <div className="mt-4">
        <div className="w-full flex justify-end md:px-6 mb-3">
          {session.role === "operation" && <Button onClick={() => exportDiagnosticsToExcel(myExams)}>Exportar Excel</Button>}
        </div>
        <DataTable
          columns={session.role === "logistics" ? columnsLogistics : columns}
          data={myExams}
          hasHeaderNumberOfRows={true}
          contentHeaderNumberOfRows={"Total de pacientes cadastrados"}
        />
      </div>
    </>
  );
}