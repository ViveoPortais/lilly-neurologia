export interface IStringMapModel {
    id: string | undefined;
    optionName : string | undefined;
    flag : string | undefined;
}

export interface IReturnMessage<T = any>{
    isValidData : boolean;
    value : T;
    additionalMessage : string;
}
