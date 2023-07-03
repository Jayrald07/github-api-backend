import axios from "axios";
import { IGithubUser } from "../typedefs/typedef.index";
import { checkCachedUsername, getCachedUsername, setCachedUsername } from "../utilities/cache";
import { GithubUserDetails } from "../domains/domain.index";

const api = axios.create({ baseURL: "https://api.github.com/users" })

const getGithubUser = async (username: string): Promise<IGithubUser> => {
    const usernameExists = await checkCachedUsername(username);

    if (usernameExists) { 
        return await getCachedUsername(username);
    }

    const user = await api.get(`/${username}`);
    const { name, login, company, public_repos, followers } = user.data;
 
    const githubUserDetails = new GithubUserDetails({ name, login, company, public_repos, followers })
 
    await setCachedUsername(username, githubUserDetails);
 
    return githubUserDetails
}

export const getGithubUserDetails = async (usernames: string[]): Promise<GithubUserDetails[]> => {
    const users = await Promise.all(usernames.map(async (username: string) => {
        try {
            const details = await getGithubUser(username);

            return new GithubUserDetails(details) 
        } catch(error) {
            return GithubUserDetails.empty(username);
        }
    }));

    return users;
}