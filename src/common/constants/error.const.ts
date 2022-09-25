/* Import Package */
import { NextFunction, Request, Response } from "express";

export type ErrorMessageType = 'REQUIRE_PARAM_NOT_FOUND' 
                             | 'REQUIRE_BODY_NOT_FOUND'
                             | 'SERVER_ERROR';

export class ErrorMessage{
    success: boolean;
    errorCode: number;
    message: string;
    data?: string;
}

export class ServiceError {
    errorType?: ErrorMessageType;
    data?: any;
}

export const ErrorHandle :Record<ErrorMessageType,ErrorMessage> = {
    'REQUIRE_PARAM_NOT_FOUND': { success: false, errorCode: 400001, message: 'notFoundParamMessage'},
    'REQUIRE_BODY_NOT_FOUND' : { success: false, errorCode: 400002, message: 'notFoundParamMessage'},
    'SERVER_ERROR'           : { success: false, errorCode: 500001, message: 'unknown server error'},
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ErrorHandler = ( error: any, request: Request, response: Response, next: NextFunction) => {
    console.debug(error);

    if(ErrorHandle[error?.errorType]){
        response.send({
            ...ErrorHandle[error.errorType],
            data: error.data || ''
        });
    }
    
    response.send({ 
        ...ErrorHandle['SERVER_ERROR'],
        data: null
    });
};