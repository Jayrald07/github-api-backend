import jwt from "jsonwebtoken";
import environment from "./environment";

export const createSession = (username: string) => {
  return jwt.sign({ username }, environment.JWT_KEY, { expiresIn: "1h" });
};

export const verifySession = (token: string) => {
  return jwt.verify(token, environment.JWT_KEY);
};
