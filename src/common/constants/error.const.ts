/* Import Package */
import { NextFunction, Request, Response } from "express";

/* Error Type */
export enum ErrorMessageEnum {
    TEMPLATE_REQUIRE_PARAM_NOT_FOUND = 'TEMPLATE_REQUIRE_PARAM_NOT_FOUND',
    TEMPLATE_REQUIRE_QUERY_NOT_FOUND = 'TEMPLATE_REQUIRE_QUERY_NOT_FOUND',
    TEMPLATE_REQUIRE_BODY_NOT_FOUND  = 'TEMPLATE_REQUIRE_BODY_NOT_FOUND',
    TEMPLATE_ROLE_NO_EXIST           = 'TEMPLATE_ROLE_NO_EXIST',
    TEMPLATE_ACCOUNT_ROLE_IS_UNIQUE  = 'TEMPLATE_ACCOUNT_ROLE_IS_UNIQUE',
    TEMPLATE_ACCOUNT_DATA_NOT_FOUND  = 'TEMPLATE_ACCOUNT_DATA_NOT_FOUND',
    TEMPLATE_SERVER_ERROR            = 'TEMPLATE_SERVER_ERROR'
}

export class ErrorMessage{
    success: boolean;
    errorCode: number;
    message: string;
    data?: string;
}

export const serviceError = (errorType: ErrorMessageEnum, data?: any) => {
    return {
        errorType,
        data,
    };
};

export const ErrorHandle :Record<ErrorMessageEnum,ErrorMessage> = {
    [ErrorMessageEnum.TEMPLATE_REQUIRE_PARAM_NOT_FOUND] : { success: false, errorCode: 400001, message: 'param not found'},
    [ErrorMessageEnum.TEMPLATE_REQUIRE_QUERY_NOT_FOUND] : { success: false, errorCode: 400003, message: 'query not fround'},
    [ErrorMessageEnum.TEMPLATE_REQUIRE_BODY_NOT_FOUND]  : { success: false, errorCode: 400002, message: 'body not fround'},
    [ErrorMessageEnum.TEMPLATE_ROLE_NO_EXIST]           : { success: false, errorCode: 400004, message: 'same data not match'},
    [ErrorMessageEnum.TEMPLATE_ACCOUNT_ROLE_IS_UNIQUE]  : { success: false, errorCode: 403001, message: 'account select role is unique'},
    [ErrorMessageEnum.TEMPLATE_ACCOUNT_DATA_NOT_FOUND]  : { success: false, errorCode: 404001, message: 'data not found'},
    [ErrorMessageEnum.TEMPLATE_SERVER_ERROR]            : { success: false, errorCode: 500001, message: 'unknown server error'},
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ErrorHandler = ( error: any, request: Request, response: Response, next: NextFunction) => {
    console.debug(error);

    if(ErrorHandle[error?.errorType]){
        response.send({
            ...ErrorHandle[error.errorType],
            data: error?.data || null
        });
    }
    
    response.send({ 
        ...ErrorHandle[ErrorMessageEnum.TEMPLATE_SERVER_ERROR],
        message: error?.message || null,
        data: error?.data || null
    });
};