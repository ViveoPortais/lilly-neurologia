import { downloadBase64File } from "@/helpers/fileHelper";
import { IAttachmentModel } from "@/types/general";
import { AiFillFilePdf } from "react-icons/ai";

type FileDownloadProps = {
    annotationType : string;
    attachment : IAttachmentModel
};

const FileDownload = ({
    annotationType,
    attachment
 }: FileDownloadProps) => {

    const handleOnClick = async (attachment : IAttachmentModel) => {
        try{
            downloadBase64File(attachment.documentBody, attachment.fileName, attachment.contentType);
        }catch(error){

        }
    }

    return (
        <>
            <div className="flex items-center gap-3 border border-zinc-300 p-3 rounded-md bg-white cursor-pointer" onClick={()=>handleOnClick(attachment)}>
                <AiFillFilePdf className="text-red-600" size={24} />
                <div className="flex flex-col text-left">
                    <p className="text-sm font-medium text-zinc-800">{annotationType}</p>
                    <p className="text-xs text-zinc-500">{`${attachment.fileSize} kb`}</p>
                </div>
            </div>
        </>
    );
};

export default FileDownload;