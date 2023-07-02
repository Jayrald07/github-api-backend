import { NextFunction, Request, Response} from "express";
import { validationResult } from "express-validator";
import { ResponseError } from "../utilities/response";
import { Message } from "../utilities/message";
import http2 from "http2";
import { verifySession } from "../utilities/session";
import { IJWTPayload, IRequest } from "../typedefs/typedef.index";
import logger from "../utilities/logger";

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(details => details.msg);

    if (errors.isEmpty()) { 
        return next(); 
    }

    next(new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_BAD_REQUEST, errors.array()));
}

export const handleAuthorization = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization as string;

        const payload = verifySession(token.replace("Bearer ","")) as IJWTPayload;

        req.username = payload.username;

        next();
    } catch(error: any) {
        next(new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_UNAUTHORIZED, [error.message]));
    }
}