import { IDiagnosticExamModel } from "@/types/diagnostic";
import FileDownload from "../custom/FileDownload";
import { IAnnotationModel, IAttachmentModel } from "@/types/general";
import { Input } from "../ui/input";
import { FiCopy } from "react-icons/fi";
import { useRef, useState } from "react";

type MatrixAccessProps = {
    data: IDiagnosticExamModel;
};

const AttachmentDetails = ({ data }: MatrixAccessProps) => {

    const [iconCopy, setIconCopy] = useState<any>({ email: "copy", password: "copy" });

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleCopy = async (typeInput: string) => {

        const ref = typeInput === "email" ? emailRef : passwordRef;
        const value = ref.current?.value;

        if (value && document.hasFocus()) {

            await navigator.clipboard.writeText(value);

            if (typeInput == "email")
                setIconCopy({ email: "copied", password: "copy" });
            else
                setIconCopy({ email: "copy", password: "copied" });


            setTimeout(() => {
                setIconCopy({ email: "copy", password: "copy" });
            }, 500);
        }
    };

    return (
        <>

            <div className="attachmentDashed w-full">
                <div className="flex flex-col md:flex-row text-left gap-6">
                    <div className="md:basis-1/3">
                        <div className="flex md:flex-col">
                            <h1 className="text-lg md:text-2xl text-left">
                                <div>Acesso do Laudo</div> 
                                <div>em Matrix</div>
                            </h1>
                        </div>
                    </div>
                    <div className="md:basis-1/3">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <Input placeholder="E-mail" inputPlaceholder="" className="cursor-pointer" value={data.voucher ?? ''} disabled={true} icon={iconCopy.email} onClickIcon={() => handleCopy("email")} ref={emailRef} />
                            </div>
                            <div className="flex flex-col">
                                <Input placeholder="Senha" inputPlaceholder="" className="cursor-pointer" value="1nYoXzKd" disabled={true} icon={iconCopy.password} onClickIcon={() => handleCopy("password")} ref={passwordRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttachmentDetails;