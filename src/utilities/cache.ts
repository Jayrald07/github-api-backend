import * as redis from "redis"
import { IGithubUser } from "../typedefs/typedef.index";
import environment from "./environment";

const client = redis.createClient({
    url: environment.REDIS_URI
});

export const getCachedUsername = async (username: string): Promise<IGithubUser> => {
    const details = await client.get(username) as string
    return JSON.parse(details);
}

export const setCachedUsername = async (username: string, data: object): Promise<void> => {
    await client.set(username, JSON.stringify(data));
    await client.expire(username, 120);
}

export const checkCachedUsername = async (username: string): Promise<boolean> => {
    const usernameExists = await client.exists(username);
    return usernameExists === 1;
}

export default client;