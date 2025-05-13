import isValidCPF, { cpfRegex, mobilephoneRegex, nameRegex } from "@/helpers/helpers";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { any, z } from "zod";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

const rolesWithEmailOnly = z.enum(["assistente", "logistica", "operacao"]);

//Esquemas de validação
export const forgetPasswordSchema = z.discriminatedUnion("role", [
 z.object({
  role: rolesWithEmailOnly,
  email: z.string().email("E-mail inválido"),
 }),
 z.object({
  role: z.literal("medico"),
  licenseNumber: z.string().min(1, "CRM obrigatório").regex(/^\d+$/, { message: "Informe apenas números" }),
  licenseState: z.string().min(1, "UF obrigatória"),
  cpf: z
   .string()
   .min(1, { message: "Insira seu CPF" })
   .regex(cpfRegex, { message: "CPF inválido" })
   .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
 }),
]);

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

//------------------------ || --------------------------//

export const doctorProfileSchema = z.object({
 specialtyDoctor: z.string().min(1).optional(),
 email: z.string().email({ message: `Insira um e-mail válido` }).optional(),
 telephoneNumber: z.string().min(1, { message: "Insira um número de celular válido" }).optional(),
 cpf: z
  .string()
  .min(1, { message: "Insira seu CPF" })
  .regex(cpfRegex, { message: "CPF inválido" })
  .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
 cep: z.string().optional(),
 street: z.string().optional(),
 number: z.string().optional(),
 complement: z.string().optional(),
 neighborhood: z.string().optional(),
 city: z.string().optional(),
 state: z.string().optional(),
 birthDate: z.string().optional(),
 programParticipationConsent: z.boolean().optional(),
 consentToReceiveEmail: z.boolean().optional(),
 consentToReceiveSms: z.boolean().optional(),
 consentToReceivePhonecalls: z.boolean().optional(),
 consentToReceiveWhatsapp: z.boolean().optional(),
});

export const professionalProfileSchema = z.object({
 email: z.string().email({ message: "Insira um e-mail válido" }).optional(),
 telephoneNumber: z.string().min(1).optional(),
 cpf: z
  .string()
  .min(1, { message: "Insira seu CPF" })
  .regex(cpfRegex, { message: "CPF inválido" })
  .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
 cep: z.string().optional(),
 street: z.string().optional(),
 number: z.string().optional(),
 complement: z.string().optional(),
 neighborhood: z.string().optional(),
 city: z.string().optional(),
 state: z.string().optional(),
 birthDate: z.string().optional(),
 programParticipationConsent: z.boolean().optional(),
 consentToReceiveEmail: z.boolean().optional(),
 consentToReceiveSms: z.boolean().optional(),
 consentToReceivePhonecalls: z.boolean().optional(),
 consentToReceiveWhatsapp: z.boolean().optional(),
});

export type DoctorProfileValidationProps = z.infer<typeof doctorProfileSchema>;
export type ProfessionalProfileValidationProps = z.infer<typeof professionalProfileSchema>;

//------------------------ || --------------------------//

export const examRequestSchema = z
 .object({
  crm: z.string().min(1, { message: "CRM é obrigatório" }).optional(),
  uf: z.string().min(1, { message: "UF é obrigatório" }).optional(),
  email: z.string().email({ message: "E-mail inválido" }).optional(),
  userName: z.string().min(1, { message: "Nome é obrigatório" }).optional(),

  diseases: z.string().min(1, { message: "Selecione uma suspeita" }),
  typeRequest: z.string().min(1, { message: "Selecione um tipo de solicitação" }),
  laboratory: z.string().min(1, { message: "Laboratório é obrigatório" }),

  collectionDate: z.string().optional(),
  collectionQuantity: z.string().optional(),
  isKitRequired: z.string().optional(),
  isNurseRequired: z.string().optional(),
  materialRequested: z.string().optional(),

  suggestNurse: z
   .string()
   .min(1, { message: "Campo 'Precisa de Enfermeiro?' não pode estar vazio" })
   .refine((val) => val === "sim" || val === "nao", {
    message: "Selecione 'Sim' ou 'Não' para 'Precisa de Enfermeiro?'",
   })
   .optional(),

  nurseName: z.string().optional(),
  nurseEmail: z.string().optional(),
  nurseCellphone: z.string().optional(),

  address: z
   .object({
    name: z.string().optional(),
    responsibleName: z.string().optional(),
    address: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    uf: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    birthDate: z.string().optional(),
    cep: z.string().optional(),
   })
   .optional(),

  location: z
   .object({
    local: z.string().optional(),
    name: z.string().optional(),
    observacoes: z.string().optional(),
    responsibleName: z.string().optional(),
    address: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    uf: z.string().optional(),
    phone: z.string().optional(),
    cpf: z
     .string()
     .regex(cpfRegex, { message: "CPF inválido" })
     .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" })
     .optional(),
    birthDate: z.string().optional(),
    cep: z.string().optional(),
    email: z.string().email({ message: "E-mail inválido" }).optional(),
   })
   .optional(),

  consent: z.boolean().refine((val) => val === true, { message: "É necessário aceitar o Termo de Consentimento Livre e Esclarecido" }),
  consentData: z.boolean().refine((val) => val === true, { message: "É necessário aceitar o Termo de Compartilhamento de dados" }),

  amountPerMonth: z.number().optional(),
  validity: z.number().optional(),
  amount: z.number().optional(),
  expirationDate: z.string().optional(),

  amountDayOneTurnOne: z.number().optional(),
  amountDayOneTurnTwo: z.number().optional(),
  amountDayOneTurnThree: z.number().optional(),
  amountDayOneTurnFour: z.number().optional(),
  recollectDate: z.string().optional(),
  amountDayTwoTurnOne: z.number().optional(),
  amountDayTwoTurnTwo: z.number().optional(),
  amountDayTwoTurnThree: z.number().optional(),
  amountDayTwoTurnFour: z.number().optional(),

  emailAddressCaregiver: z.string().optional(),
  deliveryType: z.string().optional(),
  cityVoucher: z.string().optional(),
  ufVoucher: z.string().optional(),
  voucherQuantity: z.string().optional(),

  needPostingCode: z.string().optional(),
  emailAddressCaregiverPostCode: z.string().optional(),

  fileName: z.string().optional(),
  contentType: z.string().optional(),
  documentBody: z.string().optional(),
  fileSize: z.string().optional(),

  knownMutation: z.string().optional(),
  mutationIndex: z.string().optional(),

  centrifugeRequired: z.string().optional(),
  name: z.string().optional(),
  birthDate: z.string().optional(),
  cpf: z.string().optional(),

  checkRegisteredAddress: z.boolean().optional(),
  checkRegisteredAddressInstitution: z.boolean().optional(),
 })
 .refine(
  (data) => {
   if (data.isKitRequired === "nao" && !data.isNurseRequired) {
    return false;
   }
   return true;
  },
  {
   message: "Campo 'Precisa de Enfermeiro?' não pode estar vazio quando 'É necessário kit?' for 'Não'",
   path: ["isNurseRequired"],
  }
 );
export type examRequestValidationProps = z.infer<typeof examRequestSchema>;

//------------------------ || --------------------------//

export const teamManagementValidationSchema = z.object({
 professionalTypeStringMap: z.string().min(1, { message: "Selecione uma profissão" }),
 licenseNumberCoren: z.string().min(1, { message: "Insira um CRM ou número de registro válido" }),
 licenseStateCoren: z.string().min(1, { message: "Informe um estado" }),
 professionalName: z.string().min(1, { message: "Informe o nome completo" }).regex(nameRegex, { message: "Nome inválido" }),
 mobilephone: z.string().min(1, { message: "Informe o número" }),
 emailAddress: z.string().email({ message: `Insira um e-mail válido` }),
});

export type teamManagementValidationProps = z.infer<typeof teamManagementValidationSchema>;

//------------------------ || --------------------------//

export const teamManagementProfessionalValidationSchema = z.object({
 licenseNumber: z.string().min(1, { message: "Insira um CRM válido" }),
 licenseState: z.string().min(1, { message: "Informe um estado" }),
 professionalName: z.string().optional(),
});

export type teamManagementProfessionalValidationProps = z.infer<typeof teamManagementProfessionalValidationSchema>;

//------------------------ || --------------------------//

export const moritoringExamRequestSchema = z.object({
 crm: z.string().min(1, { message: "CRM é obrigatório" }).optional(),
 uf: z.string().min(1, { message: "UF é obrigatório" }).optional(),
 email: z.string().email({ message: "E-mail inválido" }).optional(),
 userName: z.string().min(1, { message: "Nome é obrigatório" }).optional(),

 examDefinitions: z.array(z.string().uuid(), { message: "Selecione pelo menos um exame" }),

 addressCity: z.string().min(1, { message: "Cidade é obrigatória" }),
 mobilePhone: z.string().min(1, { message: "Informe o número" }),
 cpf: z
  .string()
  .min(1, { message: "Insira seu CPF" })
  .regex(cpfRegex, { message: "CPF inválido" })
  .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
 name: z.string().min(1, { message: "Nome do paciente é obrigatório" }).regex(nameRegex, { message: "Nome inválido" }),
 birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
 genderId: z.string().min(1, { message: "Informe um gênero" }),

 disease: z.string().min(1, { message: "Selecione uma suspeita" }),

 fabryClassification: z.string().optional(),

 programRegulation: z
  .boolean()
  .refine((val) => val === true, { message: "É necessário aceitar o Termo de Consentimento Livre e Esclarecido" }),
 privacyPolicy: z.boolean().refine((val) => val === true, { message: "É necessário aceitar o Termo de Compartilhamento de dados" }),
});

export type monitoringExamRequestValidationProps = z.infer<typeof moritoringExamRequestSchema>;

export const segurancaExamRequestSchema = z.object({
 crm: z.string().min(1, { message: "CRM é obrigatório" }).optional(),
 uf: z.string().min(1, { message: "UF é obrigatório" }).optional(),
 email: z.string().email({ message: "E-mail inválido" }).optional(),
 userName: z.string().min(1, { message: "Nome é obrigatório" }).optional(),

 examDefinitions: z.array(z.string().uuid(), { message: "Selecione pelo menos um exame" }),

 addressCity: z.string().min(1, { message: "Cidade é obrigatória" }),
 mobilePhone: z.string().min(1, { message: "Informe o número" }),
 cpf: z
  .string()
  .min(1, { message: "Insira seu CPF" })
  .regex(cpfRegex, { message: "CPF inválido" })
  .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
 name: z.string().min(1, { message: "Nome do paciente é obrigatório" }).regex(nameRegex, { message: "Nome inválido" }),
 birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
 genderId: z.string().min(1, { message: "Informe um gênero" }),

 disease: z.string().min(1, { message: "Selecione uma suspeita" }),

 fabryClassification: z.string().optional(),

 centrifugeRequired: z.string().optional(),

 logistics: z
  .object({
   localTypeId: z.string().optional(),
   institutionName: z.string().optional(),
   mainContact: z.string().optional(),
   addressName: z.string().optional(),
   addressNumber: z.string().optional(),
   addressComplement: z.string().optional(),
   addressDistrict: z.string().optional(),
   addressCity: z.string().optional(),
   addressState: z.string().optional(),
   institutionTelephone: z.string().optional(),
   addressPostalCode: z.string().optional(),
   institutionEmail: z.string().email({ message: "E-mail inválido" }).optional(),
  })
  .optional(),

 programRegulation: z
  .boolean()
  .refine((val) => val === true, { message: "É necessário aceitar o Termo de Consentimento Livre e Esclarecido" }),
 privacyPolicy: z.boolean().refine((val) => val === true, { message: "É necessário aceitar o Termo de Compartilhamento de dados" }),
});

export type segurancaExamRequestValidationProps = z.infer<typeof segurancaExamRequestSchema>;

export const getRegisterSignUpSchema = (role: string) =>
 z
  .object({
   doctorName: z
    .string()
    .min(1, "Nome é obrigatório")
    .regex(nameRegex, { message: "Nome inválido" })
    .refine((name) => name.trim().split(/\s+/).length >= 2, {
     message: "Informe o nome completo",
    }),
   cpf: z
    .string()
    .min(1, { message: "Insira seu CPF" })
    .regex(cpfRegex, { message: "CPF inválido" })
    .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
   emailAddress: z.string().email("E-mail inválido"),
   telephoneNumber: z.string().min(1, "Telefone é obrigatório"),
   addressPostalCode: z.string().min(1, "CEP é obrigatório"),
   addressCity: z.string().min(1, "Cidade é obrigatória").regex(nameRegex, { message: "Cidade inválida" }),
   addressState: z.string().min(1, "Estado é obrigatório"),
   consentLGPD: z.literal(true, {
    errorMap: () => ({ message: "É necessário aceitar o termo" }),
   }),
   programParticipationConsent: z.literal(true, {
    errorMap: () => ({ message: "É necessário confirmar os dados" }),
   }),

   licenseNumber: z.string().optional(),
   licenseState: z.string().optional(),
   medicalSpecialty: z.string().optional(),
  })
  .superRefine((data, ctx) => {
   if (role === "medico") {
    if (!data.licenseNumber) {
     ctx.addIssue({
      path: ["licenseNumber"],
      code: z.ZodIssueCode.custom,
      message: "Número do CRM é obrigatório",
     });
    }
    if (!data.licenseState) {
     ctx.addIssue({
      path: ["licenseState"],
      code: z.ZodIssueCode.custom,
      message: "UF do CRM é obrigatória",
     });
    }
    if (!data.medicalSpecialty) {
     ctx.addIssue({
      path: ["medicalSpecialty"],
      code: z.ZodIssueCode.custom,
      message: "Especialidade médica é obrigatória",
     });
    }
   }
  });

export const patientSchema = z
 .object({
  cpf: z
   .string()
   .min(1, { message: "Insira seu CPF" })
   .regex(cpfRegex, { message: "CPF inválido" })
   .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
  name: z.string().min(1, "Nome é obrigatório").regex(nameRegex, { message: "Nome deve conter apenas letras" }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  hasResponsible: z.enum(["yes", "no"]).optional().nullable(),
  nameCaregiver: z.string().optional(),
  cpfCaregiver: z.string().optional(),
  birthDateCaregiver: z.string().optional(),
  disease: z.string().min(1, { message: "Informe a doença" }),
  examDefinition: z.string().min(1, { message: "Descreva o exame" }),
  laboratoryAnalysis: z.string().min(1, { message: "Informe o laboratório" }),
  genderId: z.string().min(1, { message: "Informe o gênero" }),
  addressPostalCode: z.string().min(1, { message: "CEP é obrigatório" }),
  addressName: z.string().min(1, { message: "Endereço é obrigatório" }),
  addressNumber: z.string().min(1, { message: "Número é obrigatório" }),
  sector: z.string().min(1, { message: "Bairro/Setor é obrigatório" }),
  responsibleName: z.string().min(1, { message: "Nome do responsável pelo exame é obrigatório" }),
  contact: z.string().min(1, { message: "Contato é obrigatório" }),
  termConsentAttach: z.custom<File>((file) => file instanceof File && file.name !== "", {
   message: "O termo de consentimento é obrigatório",
  }),

  medicalRequestAttach: z.custom<File>((file) => file instanceof File && file.name !== "", {
   message: "O pedido médico é obrigatório",
  }),
  saveAddress: z.boolean().default(false),
 })
 .refine(
  (data) => {
   if (data.hasResponsible === "yes") {
    return data.nameCaregiver && data.cpfCaregiver && data.birthDateCaregiver;
   }
   return true;
  },
  {
   message: "Preencha os dados do responsável.",
   path: ["nameCaregiver"],
  }
 );

export const passwordSchema = z
 .object({
  oldPassword: z.string().min(1, "Preencha a senha atual"),
  newPassword: z
   .string()
   .min(12, "Ao menos um 12 caracteres")
   .regex(/[a-z]/, "Ao menos um caracter minúsculo")
   .regex(/[A-Z]/, "Ao menos um caracter maiúsculo")
   .regex(/[0-9]/, "Ao menos um número")
   .regex(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/, "Ao menos um caracter especial"),
  confirmPassword: z.string(),
 })
 .refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
 });

export type PasswordFormData = z.infer<typeof passwordSchema>;
