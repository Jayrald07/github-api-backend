import { NextFunction, Response, ErrorRequestHandler } from "express";
import { User } from "../models/model.index";
import { ResponseError, ResponseSuccess } from "../domains/domain.index";
import http2 from "http2";
import { Message } from "../utilities/message";
import { comparePassword, hashPassword } from "../utilities/hasher";
import { IRequest, IUserModel } from "../typedefs/typedef.index";
import { getGithubUserDetails } from "../service/service.index";
import { sortString } from "../utilities/sorter";


export const handleUserRegister = async (request: IRequest, response: Response, next: NextFunction) => {
    try {
        const { username, password } = request.body;

        const user = await User.findOne<IUserModel>({ where: { username } });

        if (user) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_BAD_REQUEST, [Message.USERNAME_EXISTS]);
        }

        const hashedPassword = hashPassword(password)
        const newUser = await User.create({ username, password: hashedPassword })

        await newUser.save()

        const responseDetails = new ResponseSuccess('User has been created', http2.constants.HTTP_STATUS_CREATED, {});

        response.status(http2.constants.HTTP_STATUS_CREATED).json(responseDetails)
    } catch(error) {
        next(error);
    }
}

export const handleUserLogin = async (request: IRequest, response: Response, next: NextFunction) => {
    try {
        const { username, password } = request.body;

        const user = await User.findOne<IUserModel>({ where: { username } });

        if (!user) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_UNAUTHORIZED, [Message.USERNAME_PASSWORD_INCORRECT]);
        }

        const isPasswordMatch = comparePassword(password, user.getDataValue("password"));

        if (!isPasswordMatch) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_UNAUTHORIZED, [Message.USERNAME_PASSWORD_INCORRECT]);
        } 

        const responseDetails = new ResponseSuccess('User has been logged in', http2.constants.HTTP_STATUS_OK, { token: user.generateToken() });

        response.status(http2.constants.HTTP_STATUS_OK).json(responseDetails)
    } catch(error) {
        next(error);
    }
}


export const handleGithubUserDetails = async (request: IRequest, response: Response, next: NextFunction) => {
    try {
        const usernames: string[] = request.body.usernames;

        const users = await getGithubUserDetails(usernames);

        const sorted = sortString(users);
        
        const responseDetails = new ResponseSuccess('Github user details', http2.constants.HTTP_STATUS_OK, { users: sorted });

        response.status(http2.constants.HTTP_STATUS_OK).json(responseDetails)
    } catch(error) {
        next(error);
    }
}

export const handleError: ErrorRequestHandler = (error, request: IRequest, response, next) => {
    const { code, message, errors } = error;

    response.status(code || 500).json({
        message,
        code: code || 500,
        errors: errors || []
    })
}