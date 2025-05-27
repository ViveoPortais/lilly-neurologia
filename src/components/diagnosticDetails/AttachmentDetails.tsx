import { downloadBase64File } from "@/helpers/fileHelper";
import FileDownload from "../custom/FileDownload";
import { IAnnotationModel, IAttachmentModel } from "@/types/general";

type AttachmentDetailsProps = {
    annotations : IAnnotationModel[];
};

const AttachmentDetails = ({ annotations }: AttachmentDetailsProps) => {



    return (
        <>

            <div className="attachmentDashed w-full">
                <div className="flex flex-col md:flex-row gap-6 text-left">
                    <div className="md:basis-1/3">
                        <h1 className="text-lg md:text-2xl text-left">Arquivos do Paciente</h1>
                    </div>
                    <div className="md:basis-1/3">
                        <div className="flex flex-col gap-6">
                            {annotations.map((annotation: IAnnotationModel) => (
                                <FileDownload
                                    key={annotation.id}
                                    annotationType={annotation.annotationTypeStringMap.optionName ?? ''}
                                    attachment={annotation.attachments[0]}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttachmentDetails;