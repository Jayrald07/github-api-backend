import { NextFunction, Response, ErrorRequestHandler } from "express";
import { User } from "../models/model.index";
import { ResponseError, ResponseSuccess } from "../utilities/response";
import http2 from "http2";
import { Message } from "../utilities/message";
import logger from "../utilities/logger";
import { comparePassword, hashPassword } from "../utilities/hasher";


export const handleUserRegister = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (user) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_BAD_REQUEST, [Message.USERNAME_EXISTS]);
        }

        const hashedPassword = hashPassword(password)
        const newUser = await User.create({ username, password: hashedPassword })

        await newUser.save()

        const response = new ResponseSuccess('User has been created', http2.constants.HTTP_STATUS_CREATED, {});

        res.status(http2.constants.HTTP_STATUS_CREATED).json(response)
    } catch(error) {
        next(error);
    }
}

export const handleUserLogin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_NOT_FOUND, [Message.USERNAME_PASSWORD_INCORRECT]);
        }

        user.getDataValue("password");

        const isPasswordMatch = comparePassword(password, user.getDataValue("password"));

        if (!isPasswordMatch) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_BAD_REQUEST, [Message.USERNAME_PASSWORD_INCORRECT]);
        } 

        const response = new ResponseSuccess('User has been logged in', http2.constants.HTTP_STATUS_OK, {});

        res.status(http2.constants.HTTP_STATUS_OK).json(response)
    } catch(error) {
        next(error);
    }
}

export const handleError: ErrorRequestHandler = (error, req: any, res, next) => {
    const { statusCode, message, errors } = error;

    logger.error(`${message} - ${errors.join(", ")}`)

    res.status(statusCode || 500).json({
        message,
        code: statusCode || 500,
        errors
    })
}