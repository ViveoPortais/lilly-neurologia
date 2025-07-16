import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetAnnotations } from "@/store/slices/manageFileSlice";
import { AnnotationModel } from "@/types/general";
import { useLoading } from "@/contexts/LoadingContext";

const UNIQUE_FLAG = "#CONSENT_TERM_NEURO_AND_MED_PRESC";

export function useDownloadReqConFiles() {
  const dispatch = useAppDispatch();
  const { annotations } = useAppSelector((state) => state.manageFile);
  const [file, setFile] = useState<AnnotationModel | null>(null);
  const { show, hide } = useLoading();

  useEffect(() => {
    const load = async () => {
      show();
      await dispatch(fetchGetAnnotations());
      hide();
    };

    load();
  }, [dispatch]);

  useEffect(() => {
    const match = annotations.find(
      (annotation) =>
        annotation.annotationTypeStringMap?.flag === UNIQUE_FLAG &&
        annotation.attachments?.[0]
    );

    setFile(match || null);
  }, [annotations]);

  return {
    consentAndPrescriptionFile: file,
  };
}