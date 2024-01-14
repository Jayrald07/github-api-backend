import * as redis from "redis";
import { IGithubUser } from "../typedefs/typedef.index";
import environment from "./environment";
import logger from "./logger";

const client = redis.createClient({
  url: environment.REDIS_URI,
});

export const getCachedUsername = async (
  username: string
): Promise<IGithubUser> => {
  const details = (await client.get(username)) as string;
  return JSON.parse(details);
};

export const setCachedUsername = async (
  username: string,
  data: object
): Promise<void> => {
  await client.set(username, JSON.stringify(data), { EX: 120 });
};

export const checkCachedUsername = async (
  username: string
): Promise<boolean> => {
  const usernameExists = await client.exists(username);
  return usernameExists === 1;
};

const initializeCache = async () => {
  await client.connect();
  logger.info(`Cache client connection has been initialized`);
};

export default initializeCache;
