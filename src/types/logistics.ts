
export interface IStockModel {
    id? : string;
    logisticsStuffId? : string;
    quantity? : string;
    finalQuantity? : number;
    notificationQuantity? : string;
    lot? : string;
    expirationDate? : string;
    daysBeforeExpire? : string;
    logisticsResponsibleId? : string;
    receiptInvoice? : string;
    createdOn? : string;
    modifiedOn? : string;
    deletedOn? : string;
    createdBy? : string;
    createdByName? : string;
    modifiedBy? : string;
    modifiedByName? : string;
    deletedBy? : string;
    deletedByName? : string;
    isDeleted? : string;
    ownerId? : string;
    ownerIdName? : string;
    stateCode? : string;
    statusCodeStringMapId? : string;
    friendlyCode? : string;
    name? : string;
    programCode? : string;
    logisticsStuff? : ILogisticsStuffModel;
}


export interface IStockFilterModel {
    programCode? :string;
    logisticStuffId? : string; 
    quantity? : string; 
    expirationDate? : string; 
    createdOn? : string; 
}

export interface ILogisticsStuffModel {
    id?:string;
    name? : string;
}

export interface IStockViewModel {
    logisticStuffs : ILogisticsStuffModel[];
}