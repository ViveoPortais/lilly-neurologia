export interface FormInputData {
  [key: string]: string;
}

export interface ILoginData {
  login: string;
  password: string;
  tokenByEmail?: boolean;
  tokenBySms?: boolean;
  token?: string;
}

export interface IForgetPasswordData {
  cpf: string;
  licenseNumber: string;
  licenseState: string;
}

export interface IForgetPasswordDataProfessional {
  email: string;
}

export interface IDoctorInfoByCRM {
  crm: string;
  ufcrm: string;
}

export interface IDoctorData {
  doctorName?: string;
  cpf?: string;
  licenseNumber?: string | number;
  licenseState?: string;
  medicalSpecialty?: string | undefined;
  emailAddress?: string;
  telephoneNumber?: string;
  programParticipationConsent?: boolean;
  consentLGPD?: boolean;
  addressPostalCode?: string;
  addressCity?: string;
  addressState?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface IUpdateDoctorData {
  id : string | undefined
  emailAddress: string | undefined
  mobileNumber: string | undefined
  medicalSpecialty: string | undefined
  cpf: string | undefined
  birthDate : string | undefined
  AddressPostalCode: string | undefined
  AddressCity:string | undefined
  AddressState:string | undefined
  healthProgramCode: string | undefined
}

export interface IInactiveDoctor {
  ProgramCode: string;
  DoctorByProgramId: string;
  InactiveType: string;
}

export interface DiagnosticData {
  typePatient: string;
  doctorId: string;
  name: string;
  birthdate: string;
  cpf: string;
  mobilephone?: string;
  telephone?: string;
  email: string;
  nameCaregiver?: string;
  birthdateCaregiver?: string;
  cpfCaregiver?: string;
  addressPostalCode: string;
  addressName: string;
  addressCity: string;
  addressState: string;
  addressNumber: string;
  addressDistrict: string;
  addressComplement?: string;
  genderId: string;
  medicalRequestAttach: {
    fileName: string;
    contentType: string;
    documentBody: string;
    fileSize: string;
    name: string;
    healthProgramCode: string;
  };
}

export interface TreatmentData {
  typePatient: string;
  doctorId: string;
  name: string;
  birthdate: string;
  cpf: string;
  mobilephone?: string;
  telephone?: string;
  email: string;
  nameCaregiver?: string;
  birthdateCaregiver?: string;
  cpfCaregiver?: string;
  addressPostalCode: string;
  addressName: string;
  addressCity: string;
  addressState: string;
  addressNumber: string;
  addressDistrict: string;
  addressComplement?: string;
  genderId: string;

  medicalPrescriptionAttach: {
    fileName: string;
    contentType: string;
    documentBody: string;
    fileSize: string;
    name: string;
    healthProgramCode: string;
  };
}

export interface IStringMapData {
  entityName: string;
  attributeName: string;
  programCode: string;
}

export interface IStringMap {
  id?: string;  
  stringMapId: string;
  entityMetadataId?: string;
  entityMetadataIdName?: string;
  attributeMetadataId?: string;
  attributeMetadataIdName?: string;
  optionValue?: number;
  optionName: string;
  displayOrder?: number;
  isDisabled?: boolean;
  optionNameLangEn?: string;
  programId?: string;
  isSystemOption?: boolean;
  flag?: string;
}

export interface IMedicalSpecialty {
  id: string;
  name: string;
}

export interface IOption {
  id: string;
  value: string;
}

export interface IResendToken {
  email: string;
  password: string;
  token?: string;
  tokenByEmail?: boolean;
  tokenBySms?: boolean;
}

export interface IPostIncident {
  contactTypeStringMapId: string;
  doctorId: string;
  name?: string;
  telephone1?: string;
  description?: string;
  healthProgramCode: string;
  addressCity?: string;
  addressState?: string;
  linkInteraction?: string;
  healthProfessionalName?: string;
  healthProfessionalNameTelephone?: string;
  healthProfessionalCoren?: string;
  HealthProfessionalUF?: string;
  customerAccountName?: string;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
  availabilityStart2?: string | null;
  availabilityEnd2?: string | null;
  availabilityStart3?: string | null;
  availabilityEnd3?: string | null;
}