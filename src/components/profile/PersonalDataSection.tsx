import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { maskedField } from "../custom/MaskedField";
import { IMedicalSpecialty, IStringMap } from "@/types";
import { useEffect, useState } from "react";
import { DoctorProfileValidationProps, ProfessionalProfileValidationProps } from "@/lib/utils";
import { cpfRegex, isValidPhoneNumber } from "@/helpers/helpers";

type PersonalData = {
    licenseNumber: string; // CRM ou NRO de registro
    licenseState: string;
    name: string;
    emailAddress: string;
    medicalSpecialty: string;
    mobilenumber: string;
    control: any;
    errors: any;
    specialties: IMedicalSpecialty[]
    cpf?: string;
    profileType: string
    setValue: (name: keyof DoctorProfileValidationProps | keyof ProfessionalProfileValidationProps, value: any) => void;
}

export const PersonalDataSection = ({
    licenseNumber,
    licenseState,
    name,
    emailAddress,
    medicalSpecialty,
    mobilenumber,
    control,
    errors,
    specialties,
    cpf,
    profileType,
    setValue,
}: PersonalData) => {

    useEffect(() => {
        setValue('emailAddress', emailAddress);
        setValue('mobilenumber', mobilenumber);
        setValue('medicalSpecialty', medicalSpecialty);
        setValue('cpf', cpf || '');
        setValue('licenseNumber', licenseNumber);
        setValue('licenseState', licenseState);
        setValue('name', name);
    }, [name, emailAddress, medicalSpecialty, licenseNumber, licenseState, cpf, profileType]);


    const specialtiesMapped: IStringMap[] = specialties.map((item: IMedicalSpecialty) => ({
        stringMapId: item.name,
        optionName: item.name
    }));


    const [cellphoneError, setCellphoneError] = useState<string | null>(null);

    return (
        <>
            <div className="flex flex-row justify-start text-xl">
                <h1 className="">Dados</h1>
            </div>
            {profileType === 'doctor' && (
                <div className="flex w-full flex-col md:flex-row gap-4">
                    <div className="basis-1/3">
                        <Input
                            name="licenseNumber"
                            value={licenseNumber}
                            disabled
                            placeholder={profileType === 'doctor' ? 'CRM' : 'Nro de registro'}
                        />
                    </div>
                    <div className="basis-1/3">
                        <Input
                            name="licenseState"
                            value={licenseState}
                            disabled
                            placeholder="UF do CRM"
                        />
                    </div>

                    <div className="basis-1/3">
                        <Input
                            name="medicalSpecialty"
                            value={medicalSpecialty}
                            disabled
                            placeholder="Especialidade"
                        />
                    </div>

                </div>
            )}
            <div className="flex w-full flex-col md:flex-row gap-4">
                <div className="basis-1/3">
                    <Input
                        name="name"
                        value={name}
                        disabled
                        placeholder="Nome completo"
                    />
                </div>
                <div className="basis-1/3">
                    <Controller
                        name="cpf"
                        control={control}
                        defaultValue={cpf}
                        render={({ field }) =>
                            maskedField(
                                "cpf",
                                field.onChange,
                                field.name,
                                "CPF",
                                false,
                                () => { },
                                field.value,
                                true
                            )
                        }
                    />
                    {errors.cpf && (
                        <span className="text-xs text-red-400 mt-1">
                            {errors.cpf.message}
                        </span>
                    )}
                </div>
                <div className="basis-1/3">
                    <Controller
                        name="mobilenumber"
                        control={control}
                        defaultValue={mobilenumber}
                        render={({ field }) => {
                            const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                let value = e.target.value;

                                const cleanPhone = value.replace(/\D/g, '');
                                if (isValidPhoneNumber(cleanPhone)) {
                                    field.onChange(value);
                                    setCellphoneError(null);
                                } else {
                                    setCellphoneError("Telefone inválido");
                                    field.onChange(value);
                                }
                            }
                            return (
                                maskedField(
                                    "cellphone",
                                    handlePhoneChange,
                                    field.name,
                                    "Celular",
                                    false,
                                    () => { },
                                    field.value
                                )
                            )
                        }}
                    />
                    {cellphoneError && (
                        <span className="text-xs text-red-400 mt-1 mr-1">{cellphoneError}</span>
                    )}
                    {errors.mobilenumber && (
                        <span className="text-xs text-red-400 mt-1">
                            {errors.mobilenumber.message}
                        </span>
                    )}
                </div>
            </div>

        </>
    );
}
