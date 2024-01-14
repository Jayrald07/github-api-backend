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
  username?: string;
  logId?: string;
  test?: number;
}

export interface IJWTPayload extends JwtPayload {
  username: string;
}

export interface IGithubUser {
  name: string | null;
  company: string | null;
  login: string;
  followers: number | null;
  public_repos: number | null;
  averageFollowers?: number | null;
}
