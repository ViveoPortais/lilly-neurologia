import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { AddressData } from "@/services/api";
import { maskedField } from "../custom/MaskedField";
import { DoctorProfileValidationProps, ProfessionalProfileValidationProps } from "@/lib/utils";
import { DatePickerComponent } from "../custom/CustomCalendar";
import { useEffect } from "react";
import { toast } from "react-toastify";
import DateField from "../custom/CustomNewCalendar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCEP } from "@/store/slices/profileSlice";

type AddressSectionProps = {
    control: any;
    errors: any;
    addressPostalCode: string;
    addressCity: string;
    addressState: string;
    setValue: (name: keyof DoctorProfileValidationProps | keyof ProfessionalProfileValidationProps, value: any) => void;
    setFocus: any;
};

export const AddressSection = ({
    control,
    errors,
    addressPostalCode,
    addressCity,
    addressState,
    setValue,
    setFocus,
}: AddressSectionProps) => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        setValue('addressPostalCode', addressPostalCode || '');
        setValue('addressCity', addressCity || '');
        setValue('addressState', addressState || '');
    }, [addressPostalCode, addressCity, addressState, setValue])

    const handleCepBlur = async (cepValue: string) => {
        if (cepValue.length === 9) {

            const result = await dispatch(fetchCEP({cep : cepValue})).unwrap();

            if (result) {
                setValue('addressCity', result.localidade || '');
                setValue('addressState', result.uf || '');
            } else {
                toast.error('CEP inválido ou não encontrado');
            }
        }
    };


    return (
        <>
            <div className="flex flex-row justify-start text-xl">
                <h1 className="">Endereço</h1>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="basis-1/3">
                        <Controller
                            name="addressPostalCode"
                            control={control}
                            defaultValue={addressPostalCode}
                            render={({ field }) => (
                                <div className="flex flex-col w-full">
                                    {maskedField(
                                        'cep',
                                        field.onChange,
                                        field.name,
                                        'CEP',
                                        false,
                                        () => handleCepBlur(field.value),
                                        field.value
                                    )}
                                    {errors.addressPostalCode && (
                                        <span className="text-xs text-red-400 mt-1">
                                            {errors.addressPostalCode.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <div className="basis-1/3">
                        <Controller
                            name="addressCity"
                            control={control}
                            defaultValue={addressCity}
                            render={({ field }) => (
                                <div className="flex flex-col w-full">
                                    <Input
                                        placeholder="Cidade"
                                        {...field}
                                        value={field.value}
                                    />
                                    {errors.addressCity && (
                                        <span className="text-xs text-red-400 mt-1">
                                            {errors.addressCity.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <div className="basis-1/3">
                        <Controller
                            name="addressState"
                            control={control}
                            defaultValue={addressState}
                            render={({ field }) => (
                                <div className="flex flex-col w-full">
                                    <Input
                                        placeholder="UF"
                                        {...field}
                                        value={field.value}
                                    />
                                    {errors.addressState && (
                                        <span className="text-xs text-red-400 mt-1">
                                            {errors.addressState.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
