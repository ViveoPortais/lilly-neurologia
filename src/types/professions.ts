import { IStringMapModel } from "./general";

interface listProfessions {
    id: string;
    value: string;
}

export interface IProfessionalData {
  name?: string;
  cpf?: string;
  mobilephone1?: string;
  emailAddress1?: string;
  addressPostalCode?: string;
  addressCity?: string;
  addressState?: string;
  programParticipationConsent?: boolean;
  consentLGPD?: boolean;
  [key: string]: string | number | boolean | undefined;
}

  export interface IUpdateProfessionalData {
    id?: string;
    emailAddress?: string;
    mobilePhone1?: string;
    cpf?: string;
    programCode?: string;
    AddressPostalCode?: string;
    AddressCity?: string;
    AddressState?: string;
  }

  export interface IHealthProfessionalByProgramModel {
    id : string;
    name : string;
    emailAddress1 : string;
  }

  export interface IDoctorByProgramModel {
    id : string;
    name : string;
    licenseNumber : string;
    licenseState : string;
    emailAddress1 : string;
  }

  export interface IHealthProfessionalByProgramDoctorByProgram {
    id : string;
    healthProfessionalByProgram : IHealthProfessionalByProgramModel;
    doctorByProgram : IDoctorByProgramModel;
    statusCodeStringMap : IStringMapModel;
    aproveDate : string;
    reproveDate : string;
    createdOn : string;
  }