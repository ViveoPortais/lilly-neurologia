import {IRequestSignerModel, IRequestSignModel } from "@/types/diagnostic";
import CircleStatusCustom from "../custom/CircleStatusCustom";

type DigitalSignatureDetailsProps = {
    data : IRequestSignModel | null;
};

const DigitalSignatureDetails = ({ data }: DigitalSignatureDetailsProps) => {

    const translateStatus = (status : string | undefined) => {

        switch(status){
            case "created":
            case "sent":
            case "delivered":
                return (
                    <div className="flex flex-row gap-1">
                        <CircleStatusCustom color="bg-yellow-400" />
                        <span>Pendente</span>
                    </div>
                )
            case "signed":
            case "completed":
                return (
                    <div className="flex flex-row gap-1">
                        <CircleStatusCustom color="bg-green-500" />
                        <span>Assinado</span>
                    </div>
                )
            case "declined":
            case "voided":
                return (
                    <div className="flex flex-row gap-1">
                        <CircleStatusCustom color="bg-red-600" />
                        <span>Cancelado</span>
                    </div>
                )
            default : 
                return (
                    <div className="flex flex-row gap-1">
                        <CircleStatusCustom color="bg-yellow-400" />
                        <span>Pendente</span>
                    </div>
                )

        }
    }

    if(data === null){
        return(
            <>
                <div className="attachmentDashed w-full">
                    <h1 className="text-2xl text-left mb-10">Detalhes da Assinatura Digital</h1>
                    <h2 className="text-xl text-center"> Assinatura Digital em Processamento...</h2>
                </div>
            </>
        );
    }
    else{
        return (
            <>
                <div className="attachmentDashed w-full">
                    <h1 className="text-2xl text-left mb-8">Detalhes da Assinatura Digital</h1>
                    <div className="flex flex-col md:flex-row gap-6 text-base">
                        {data.signers?.map((item: IRequestSignerModel) => (
                            <>
                                <div className="flex flex-col w-[50%] text-left border border-gray-400 rounded-xl p-3 gap-3 bg-white">
                                    <div className="flex flex-row gap-1">
                                        Nome : {item.name} ({item.role == "Doctor" ? "Médico" : "Paciente"})
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        Email : {item.email}
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        Status : {translateStatus(item.status)}
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>

                </div>
            </>
        );
    }
};

export default DigitalSignatureDetails;