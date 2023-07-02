import { NextFunction, Request, Response} from "express";
import { validationResult } from "express-validator";
import { ResponseError } from "../utilities/response";
import { Message } from "../utilities/message";
import http2 from "http2";

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(details => details.msg);

    if (errors.isEmpty()) { 
        return next(); 
    }

    next(new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_BAD_REQUEST, errors.array()));
}