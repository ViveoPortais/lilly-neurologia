import { useState } from "react";
import { Button } from "../ui/button";
import GenericModalForm from "../modals/GenericModalForm";
import AlterPasswordModal from "../modals/AlterPasswordModal";
import { DoctorProfileValidationProps, ProfessionalProfileValidationProps } from "@/lib/utils";
import { Input } from "../ui/input";


type AccessData = {
    emailAddress: string; 
    control: any,
    errors : any,
    setValue : (name: keyof DoctorProfileValidationProps | keyof ProfessionalProfileValidationProps, value: any) => void;
}
export const AccessSection = ({
    emailAddress,
    control,
    errors,
    setValue
}:AccessData) => {

    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    return (
        <>
            <div className="flex flex-row justify-start text-xl">
                <h1 className="">Acesso</h1>
            </div>
            <div className="flex w-full flex-col md:flex-row gap-4">
                <div className="md:basis-1/3">
                    <Input
                        name="emailAddress"
                        value={emailAddress}
                        disabled
                        placeholder="E-mail"
                    />
                </div>
                <div className="md:basis-1/6">
                    <Button type="button" variant={"outlineMainlilly"} className="w-full md:mt-7" size={"lg"} onClick={() => { setPasswordModalOpen(true)}}>
                        Mudar Senha
                    </Button>
                </div>
            </div>
               <GenericModalForm
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                title="Atualizar Senha"
                children={<AlterPasswordModal isOpenExternally={isPasswordModalOpen} onCloseExternally={() => setPasswordModalOpen(false)} />}
               />
        </>
    );
}
