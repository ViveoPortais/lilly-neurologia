import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetAnnotations } from "@/store/slices/manageFileSlice";
import { AnnotationModel } from "@/types/general";
import { useLoading } from "@/contexts/LoadingContext";

const TYPE_MAP = {
 CONSENT: "#TERM_CONSENT",
 REQUEST: "#MEDICAL_REQUEST",
};

export function useDownloadReqConFiles() {
 const dispatch = useAppDispatch();
 const { annotations } = useAppSelector((state) => state.manageFile);
 const [consentFile, setConsentFile] = useState<AnnotationModel | null>(null);
 const [requestFile, setRequestFile] = useState<AnnotationModel | null>(null);
 const { show, hide } = useLoading();

 useEffect(() => {
  const load = async () => {
   show();
   await dispatch(fetchGetAnnotations());
   hide();
  };

  load();
 }, []);

 useEffect(() => {
  let consent: AnnotationModel | null = null;
  let request: AnnotationModel | null = null;

  annotations.forEach((annotation) => {
   const type = annotation.annotationTypeStringMap?.flag;

   if (type === TYPE_MAP.CONSENT && annotation.attachments?.[0]) {
    consent = annotation;
   }

   if (type === TYPE_MAP.REQUEST && annotation.attachments?.[0]) {
    request = annotation;
   }
  });

  setConsentFile(consent);
  setRequestFile(request);
 }, [annotations]);

 return {
  consentFile,
  requestFile,
 };
}