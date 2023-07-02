import { NextFunction, Response, ErrorRequestHandler, Request } from "express";
import { User } from "../models/model.index";
import { ResponseError, ResponseSuccess } from "../utilities/response";
import http2 from "http2";
import { Message } from "../utilities/message";
import logger, { requestLogger } from "../utilities/logger";
import { comparePassword, hashPassword } from "../utilities/hasher";
import { IRequest, IUserModel } from "../typedefs/typedef.index";
import { getGithubUser } from "../service/service.index";
import { sortString } from "../utilities/sorter";
import { GithubUserDetails } from "../domains/domain.index";


export const handleUserRegister = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne<IUserModel>({ where: { username } });

        if (user) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_BAD_REQUEST, [Message.USERNAME_EXISTS]);
        }

        const hashedPassword = hashPassword(password)
        const newUser = await User.create({ username, password: hashedPassword })

        await newUser.save()

        const response = new ResponseSuccess('User has been created', http2.constants.HTTP_STATUS_CREATED, {});

        res.status(http2.constants.HTTP_STATUS_CREATED).json(response)

        requestLogger(req, {message: 'User has been created', code: http2.constants.HTTP_STATUS_CREATED });
    } catch(error) {
        next(error);
    }
}

export const handleUserLogin = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne<IUserModel>({ where: { username } });

        if (!user) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_UNAUTHORIZED, [Message.USERNAME_PASSWORD_INCORRECT]);
        }

        const isPasswordMatch = comparePassword(password, user.getDataValue("password"));

        if (!isPasswordMatch) {
            throw new ResponseError(Message.REQUEST_ERROR, http2.constants.HTTP_STATUS_UNAUTHORIZED, [Message.USERNAME_PASSWORD_INCORRECT]);
        } 

        const response = new ResponseSuccess('User has been logged in', http2.constants.HTTP_STATUS_OK, { token: user.generateToken() });

        res.status(http2.constants.HTTP_STATUS_OK).json(response)

        requestLogger(req, { message: 'User has been logged in', code: http2.constants.HTTP_STATUS_OK });
    } catch(error) {
        next(error);
    }
}


export const handleGithubUserDetails = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const usernames: string[] = req.body.usernames;

        const users = await Promise.all(usernames.map(async (username: string) => {
            try {
                const details = await getGithubUser(username);

                return new GithubUserDetails(details) 
            } catch(error) {
                return GithubUserDetails.empty(username);
            }
        }))

        const sorted = sortString(users);
        
        const response = new ResponseSuccess('Github user details', http2.constants.HTTP_STATUS_OK, { users: sorted });

        res.status(http2.constants.HTTP_STATUS_OK).json(response)

        requestLogger(req, { message: 'Github user details', code: http2.constants.HTTP_STATUS_OK});
    } catch(error) {
        next(error);
    }
}

export const handleError: ErrorRequestHandler = (error, req: IRequest, res, next) => {
    const { code, message, errors } = error;

    res.status(code || 500).json({
        message,
        code: code || 500,
        errors: errors || []
    })

    requestLogger(req, { code: code || 500, errors: errors || [] })
}