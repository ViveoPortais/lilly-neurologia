import { IStringMap } from ".";
import { AttachmentModel } from "./diagnostic";

export interface IReturnMessage<T = any>{
    isValidData : boolean;
    value : T;
    additionalMessage : string;
}

export interface IPaginationResult <T = any>{
    totalSize : number;
    data : T;
    results : any;
    totalCount : any;
}

export interface IAnnotationModel {
    id:string;
    hasAttachment :boolean;
    annotationTypeStringMap:IStringMap;
    attachments :IAttachmentModel[];
}

export interface IAttachmentModel{
    fileName : string;
    contentType : string;
    fileSize : string;
    fileType : string;
    documentBody : string;
}

export interface AnnotationModel {
 id?: string;
 name?: string;
 hasAttachment?: boolean;
 annotationTypeStringMap?: IStringMap;
 attachments: AttachmentModel[];
 programCode?: string;
 modifiedByName?: string;
 modifiedOn?: string;
 annotationTypeStringMapId?: string;
}

export interface IAnnotationFilterModel {
  entityMetadataIdName?: string;
  regardingObjectId?: string;
  programCode?: string;
}