import axios from "axios";
import { IGithubUser } from "../typedefs/typedef.index";
import { checkCachedUsername, getCachedUsername, setCachedUsername } from "../utilities/cache";
import { GithubUserDetails } from "../domains/domain.index";

export const getGithubUser = async (username: string): Promise<IGithubUser> => {
    const usernameExists = await checkCachedUsername(username);

    if (usernameExists) { 
        return await getCachedUsername(username);
    }

    const user = await axios.get(`https://api.github.com/users/${username}`);
    const { name, login, company, public_repos, followers } = user.data;
 
    const githubUserDetails = new GithubUserDetails({ name, login, company, public_repos, followers })
 
    await setCachedUsername(username, githubUserDetails);
 
    return githubUserDetails
}