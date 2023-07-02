import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Model } from "sequelize";

export interface IUserModel extends Model {
    id: number;
    username: string;
    password: string;
    generateToken(): string;
}

export interface IRequest extends Request {
    username: string
}

export interface IJWTPayload extends JwtPayload {
    username: string;
}