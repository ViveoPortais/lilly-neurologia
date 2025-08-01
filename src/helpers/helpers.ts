import { useGenericModal } from "@/contexts/GenericModalContext";
import { format, isAfter, parseISO } from "date-fns";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export default function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0,
    remainder;

  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.substring(10, 11));
}

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "");
  return mobilephoneRegex.test(cleanPhone);
};

export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
export const mobilephoneRegex = /^(?!00)([1-9]{2})9\d{8}(?!\d\1{4})$/;
export const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};

export const formatDate = (date?: string | Date | null): string => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export const formatFileSize = (size?: string | number | null): string => {
  if (!size) return "Tamanho desconhecido";
  return `${(Number(size) / 1024).toFixed(1)} KB`;
};

export const today = format(new Date(), "yyyy-MM-dd");

type SetValueFn<T> = (name: keyof T, value: string) => void;

export function validateNoFutureDate<T>(value: string, fieldName: keyof T, setValue: SetValueFn<T>, warningMessage: string) {
  const selectedDate = parseISO(value);
  const today = new Date();

  if (isAfter(selectedDate, today)) {
    toast.warning(warningMessage);
    setValue(fieldName, "");
    return false;
  } else {
    setValue(fieldName, value);
    return true;
  }
}

export function validateBirthDateRange(value: string, fieldName: string, setValue: any) {
  const birthDate = dayjs(value);
  const today = dayjs();
  const age = today.diff(birthDate, "year");

  if (age < 55 || age > 85) {
    toast.warning("Paciente deve ter entre 55 e 85 anos.");
    setValue(fieldName, "");
    return false;
  }
  return true;
}

export function validateBirthDate(value: string, fieldName: string, setValue: any) {
  const isValidDate = validateNoFutureDate(value, fieldName, setValue, "Não é permitido cadastrar data futura");
  if (!isValidDate) return;

  const isValidAge = validateBirthDateRange(value, fieldName, setValue);
  if (!isValidAge) return;
}

export const allowedSpecialties = ["NEUROLOGIA", "PSIQUIATRIA", "GERIATRIA"];