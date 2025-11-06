import { IStringMap } from ".";

export interface ExamCreateModel {
  doctorId?: string | null;
  disease?: string | null;
  examDefinition?: string | null;
  laboratoryAnalysis?: string | null;
  withDrawalDate?: string | null;
  logisticStuffId?: string | null;
  needKit?: boolean | null;
  logistics?: LogisticsModel | null;
  addressPostalCode?: string | null;
  addressName?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  addressDistrict?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  telephone?: string | null;
  cpfCaregiver?: string | null;
  nameCaregiver?: string | null;
  emailAddressCaregiver?: string | null;
  birthDateCaregiver?: string | null;
  healthProfessional?: HealthProfessionalCreateModel | null;
  consentFormCompleted?: boolean | null;
  programParticipationConsent?: boolean | null;
  medicalRequestAttach?: AttachmentModel | null;
  termConsentAttach?: AttachmentModel | null;
  centrifugeRequired?: boolean | null;
  name?: string | null;
  birthDate?: string | null;
  cpf?: string | null;
  voucherReceiptType?: string | null;
  healthProfessionalId?: string | null;
  genderId?: string | null;
  sector?: string | null;
  responsibleName?: string | null;
  contact?: string | null;
  saveAddress?: boolean | null;
  clinicalProfile?: string | null;
  hasClinicalProfile?: boolean | null;
  hasDigitalSignature? : boolean | null;
  email? : string | null;
  emailAddress? : string | null;
  logisticsAddressCommercial?: boolean | null;
  addressCommercial?: boolean | null;
}

export interface IDiagnosticExamModel {
  id: string;
  doctorId?: string | null;
  createdOn?: string | null;
  numberProtocol?: string | null;
  namePatient?: string | null;
  diseaseName?: string | null;
  diseaseId?: string | null;
  localName?: string | null;
  nameDoctor?: string | null;
  licenseNumber?: string | null;
  licenseState?: string | null;
  emaillAddressDoctor?: string | null;
  typeProfessionalName?: string | null;
  professionalName?: string | null;
  professionalEmail?: string | null;
  professionalMobilephone?: string | null;
  professionalLicenseNumber?: string | null;
  professionalLicenseState?: string | null;
  professionalSugestedName?: string | null;
  professionalSugestedEmail?: string | null;
  professionalSugestedMobilephone?: string | null;
  realizationDate?: string | null;
  cpf?: string | null;
  patientPhase?: string | null;
  patientStatus?: string | null;
  patientStatusId?: string | null;
  patientEmail?: string | null;
  patientBirthDate?: string | null;
  patientMobilephone?: string | null;
  patientTelephone?: string | null;
  patientUserPassword?: string | null;
  examDefinition?: string | null;
  voucher?: string | null;
  scheduledDate?: string | null;
  scheduledDateStart?: string | null;
  scheduledDateEnd?: string | null;
  examStatus?: string | null;
  clinicName?: string | null;
  examStatusId?: string | null;
  reasonPendingCanceled?: string | null;
  programParticipation?: string | null;
  fileReport?: string | null;
  result?: string | null;
  resultId?: string | null;
  statusSms?: string | null;
  examAudit?: string | null;
  addressPostalCode?: string | null;
  addressComplement?: string | null;
  addressName?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressNumber?: string | null;
  addressDistrict?: string | null;
  statusDetail?: string | null;
  statusPhase?: string | null;
  isOnboardingAnswered?: string | null;
  firstPhonecallDate?: string | null;
  lastPhonecallDate?: string | null;
  diagnosticId?: string | null;
  logisticsStatus?: string | null;
  customDateTime2?: string | null;
  logisticsDateForecast?: string | null;
  hasPending?: string | null;
  withdrawalDate?: string | null;
  amount?: string | null;
  needKit?: string | null;
  institutionName?: string | null;
  institutionEmail?: string | null;
  institutionTelephone?: string | null;
  description?: string | null;
  logisticsStuffName?: string | null;
  localTypeStringMapName?: string | null;
  mainContact?: string | null;
  createdByName?: string | null;
  centrifugeRequired?: string | null;
  logisticsAddressPostalCode?: string | null;
  logisticsAddressComplement?: string | null;
  logisticsAddressName?: string | null;
  logisticsAddressCity?: string | null;
  logisticsAddressState?: string | null;
  logisticsAddressNumber?: string | null;
  logisticsAddressDistrict?: string | null;
  voucherReceiptTypeName?: string | null;
  knownMutation?: string | null;
  mutationIndex?: string | null;
  amountDayOneTurnOne?: string | null;
  amountDayOneTurnTwo?: string | null;
  amountDayOneTurnTree?: string | null;
  amountDayOneTurnFour?: string | null;
  amountDayTwoTurnOne?: string | null;
  amountDayTwoTurnTwo?: string | null;
  amountDayTwoTurnTree?: string | null;
  amountDayTwoTurnFour?: string | null;
  needPostingCode?: string | null;
  postingCode?: string | null;
  emailToSendPostCode?: string | null;
  recollectDate?: string | null;
  amountPerMonth?: string | null;
  expirationDate?: string | null;
  validity?: string | null;
  nameCaregiver?: string | null;
  birthdateCaregiver?: string | null;
  telephone?: string | null;
  cpfCarefiver?: string | null;
  mobileNumber?: string | null;
  telephoneNumber?: string | null;
  doctorName?: string | null;
  examStatusStringMap?: IStringMap | null;
  mobilephoneCaregiver?: string | null;
  section?: string | null;
  schedulingHistory?: ISchedulingHistoryResultModel[];
  reasonExamNotDoneStringMap?: IStringMap;
  resultStringMap?: IStringMap;
  examDefinitionId?: string | null;
  localId?: string | null;
  genderId?: string | null;
  clinicalProfile?: IStringMap;
  hasClinicalProfile?: boolean;
  phosphorylatedTau?: string | null;
  totalTau?: string | null;
  pTauToBA42Ratio?: string | null;
  betaAmyloidPeptide42?: string | null;
  labelAttachment?: AttachmentModel[];
  pendingExam?: string | null;
  loginMatrix?: string | null;
  passwordMatrix?: string | null;
  hasDigitalSignature? : boolean | null;
  logisticsLocal?: IAccountModel |null; 
  logisticsScheduleLocal?: IAccountModel |null; 
  preferredTimeStringMap?: IStringMap | null; 
  deliveryTubeContact? : string | null; 
  deliveryTubeTelephone? : string | null; 
  doctorSuggestedDate?: string | null;
  addressCommercial?:boolean | null;
  logisticsAddressCommercial?:boolean | null;
}


export interface LogisticsModel {
  InstitutionName?: string | null;
  InstitutionEmail?: string | null;
  description?: string | null;
  addressPostalCode?: string | null;
  addressName?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  addressDistrict?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  mainContact?: string | null;
  InstitutionTelephone?: string | null;
  localTypeId?: string | null;
  amountPerMonth?: number | null;
  validity?: number | null;
  amount?: number | null;
  expirationDate?: string | null;
  recollectDate?: string | null;
  amountDayOneTurnOne?: number | null;
  amountDayOneTurnTwo?: number | null;
  amountDayOneTurnTree?: number | null;
  amountDayOneTurnFour?: number | null;
  amountDayTwoTurnOne?: number | null;
  amountDayTwoTurnTwo?: number | null;
  amountDayTwoTurnTree?: number | null;
  amountDayTwoTurnFour?: number | null;
  knownMutation?: boolean | null;
  mutationIndex?: string | null;
  needPostingCode?: boolean | null;
  emailToSendPostCode?: string | null;
  addressCommercial?: boolean | null;
}

export interface HealthProfessionalCreateModel {
  name?: string | null;
  email?: string | null;
  telephone?: string | null;
}

export interface AttachmentModel {
  fileName?: string | null;
  contentType?: string | null;
  documentBody?: string | null;
  fileSize?: string | null;
  fileType?: string | null;
  annotationTypeStringMapCode?: string | null;
  annotationTypeStringMapId?: string | null;
  healthProgramCode?: string | null;
  name?: string | null;
  annotationTypeName?: string | null;
  pendencyDescription?: string | null;
  flag?: string | null;
}

export interface IDiagnosticFilterModel {
  patientName?: string;
  patientCPF?: string;
  examStatus?: string;
  doctor?: string;
}

export interface ExamPendingModel {
  id: string;
  diagnosticId?: string;
  numberProtocol?: string;
  voucher?: string;
  patientName?: string;
  doctorName?: string;
  reason?: string;
  isDocumentTermApproved?: boolean;
  isDocumentMedicApproved?: boolean;
  dateCreate?: string;
  dateUpdate?: string;
  sentAt?: string;
  deliveryConfirmedAt?: string;
  attachments?: AttachmentModel[];
  flagStatus?: string;
  logistAttachments?: AttachmentModel;
  examCollectionDate?: string;
  examPickupDate?: string;
  nameHealthProfessional?: string;
  examAnalysis?: IAnalysisSampleModel;
  logistcSuggestedDate1?: string;
  logistcSuggestedDate2?: string;
  logistcSuggestedDate3?: string;
  timeSuggested1?:string;
  timeSuggested2?:string;
  timeSuggested3?:string;
  collectMaterial?: string;
  doctorSuggestedDate?: string;
  isPickupRequestApproved?: boolean;
  dateForCollecting?: string;
  doctorSelectedDate?: string;
  incidentStatusStringMapId?: string;
  preferredTimeStringMapId?:string;
  preferredTimeStringMap?: IStringMap;
  custom1StringMap?:IStringMap;
  custom2StringMap?:IStringMap;
  custom3StringMap?:IStringMap;
}

export interface ResolveExamPendency {
  id: string;
  Attachments?: AttachmentModel[];
}

export interface PatientData {
  fullName: string;
  birthdate: string;
  examDefinition: string;
  disease: string;
  laboratoryAnalysis: string;
  requestDate: string;
  receiptDate: string;
}

export interface ISchedulingHistoryResultModel {
  id: string;
  requestDate: string;
  statusName: string;
  description: string;
}

export interface PendingResponse {
  documents: DocumentPendingModel[];
  labels: LabelPendingModel[];
  tubes: TubePendingModel[];
  batchPendingDeclarations: ExamPendingModel[];
  printDocuments : IPrintDocumentsModel[];
  generateBatchDeclarations: ExamPendingModel[];
  pendingAssociations: IPendingAssociationModel[];
  confirmPickupRequests: IPickupRequestModel[];
  pickupRequest: IPickupRequestModel[];
  problemWithSamples: IProblemWithSampleModel[];
  confirmSampleDeliveries: IConfirmSampleDeliveryModel[];
  analyzes: IConfirmSampleDeliveryModel[];
}

export interface TubePendingModel extends ExamPendingModel {
  deliveryDate : string;
}

export interface DocumentPendingModel extends ExamPendingModel {
  examId: string;
  voucher: string;
  doctorName?: string;
  attachments: AttachmentModel[];
}

export interface IPrintDocumentsModel extends ExamPendingModel {
  sentDate: string;
  dateForCollecting: string;
  attachments: AttachmentModel[];
}

export interface LabelPendingModel extends ExamPendingModel {
  attachments: AttachmentModel[];
  addressPostalCode?: string;
  addressComplement?: string;
  addressName?: string;
  addressCity?: string;
  addressState?: string;
  addressNumber?: string;
  addressDistrict?: string;
  section?: string;
  institutionTelephone?: string;
  logisticsLocal?: IAccountModel;
  addressCommercial?: boolean;
}

export interface IExamCancellationModel {
  id?: string;
  examCancellationReason?: string;
}

export interface IPendingAssociationModel extends ExamPendingModel {
  registerDate?: string;
  nameHealthProfessional?: string;
  doctorByProgramId?: string;
  helathProfessionalByProgramId?: string;
}

export interface IPickupRequestModel extends ExamPendingModel {
  examPickupDate?: string;
  addressPostalCode?: string;
  addressComplement?: string;
  addressName?: string;
  addressCity?: string;
  addressState?: string;
  addressNumber?: string;
  addressDistrict?: string;
  section?: string;
  institutionTelephone?: string;
  logisticsScheduleLocal?: IAccountModel;
  addressCommercial?: boolean;
}

export interface IProblemWithSampleModel extends ExamPendingModel {
  incidentStatus?: string;
}

export interface IConfirmSampleDeliveryModel extends ExamPendingModel {
  doctorName?: string;
  sentDate?: string;
  confirmWithdrawalDate?: string;
}

export interface IAnalysisSampleModel {
  betaAmyloidPeptide42?: string;
  phosphorylatedTau?: string;
  pTauToBA42Ratio?: string;
  totalTau?: string;
  analysisEndDate?: string;
  loginMatrix?: string;
  passwordMatrix?: string;
  resultInconclusive? : boolean;
}

export interface IPatientSampleCollectionViewModel {
  examId: string;
  patientName?: string
  dateOfBirth?: string;
  examRequestDate?: string;
  tubeReceptionDate?: string;
  attachments?: AttachmentModel[];
}

export interface IRequestSignModel {
  systemClientId? : string;
  externalId? : string;
  templateId? : string;
  signers? : IRequestSignerModel[];
}

export interface IRequestSignerModel {
    name?:string;
    email?:string;
    role?:string;
    status?:string;
}

export interface IDocumentFilledRequestModel{
    examCreateModel?: ExamCreateModel;
    annotationTypeStringMapFlag?:string;
    examId?:string;
}
export interface IAccountModel {
  id?: string | null;
  name?: string | null;
  companyName?: string | null;
  cnpj?: string | null;
}