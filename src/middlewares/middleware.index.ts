import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ResponseError } from "../domains/domain.index";
import { Message } from "../utilities/message";
import http2 from "http2";
import { verifySession } from "../utilities/session";
import { IJWTPayload, IRequest } from "../typedefs/typedef.index";
import crypto from "crypto";
import logger from "../utilities/logger";

export const handleValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request).formatWith((details) => details.msg);

  if (errors.isEmpty()) {
    return next();
  }

  next(
    new ResponseError(
      Message.REQUEST_ERROR,
      http2.constants.HTTP_STATUS_BAD_REQUEST,
      errors.array()
    )
  );
};

export const handleAuthorization = (
  request: IRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization as string;

    const payload = verifySession(token.replace("Bearer ", "")) as IJWTPayload;

    request.username = payload.username;

    next();
  } catch (error: any) {
    next(
      new ResponseError(
        Message.REQUEST_ERROR,
        http2.constants.HTTP_STATUS_UNAUTHORIZED,
        [error.message]
      )
    );
  }
};

export const handleRequestLogging = (
  request: IRequest,
  response: Response,
  next: NextFunction
) => {
  const { headers, method, originalUrl, ip } = request;
  let logId = crypto.randomBytes(5).toString("hex");
  const startTime = Date.now();

  request.logId = logId;

  logger.info(
    `Started ${method} ${originalUrl} for ${ip} headers: ${JSON.stringify(
      headers
    )}`,
    { logId }
  );

  response.on("finish", () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const level = response.statusCode >= 400 ? "error" : "info";

    logger.log(level, `Completed ${response.statusCode} in ${responseTime}ms`, {
      logId,
    });
  });

  next();
};
