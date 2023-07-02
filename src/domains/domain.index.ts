import { IGithubUser } from "../typedefs/typedef.index";

class Response {
    public message: string;
    public code: number;

    constructor(message: string, code: number) {
        this.message = message;
        this.code = code;
    }
}

export class ResponseSuccess extends Response {
    public data: object;

    constructor(message: string, code: number, data: object) {
        super(message, code)
        this.data = data
    }
}

export class ResponseError extends Response {
    public errors: string[];

    constructor(message: string, code: number, errors: string[]) {
        super(message, code);
        this.code = code
        this.errors = errors
    }
}

export class GithubUserDetails {
    public name: string | null = null;
    public login: string = '';
    public company: string | null = null;
    public public_repos: number | null = null;
    public followers: number | null = null;
    public averageFollowers: number | null = null;

    constructor(details: IGithubUser) {
        this.name = details.name;
        this.login = details.login;
        this.company = details.company;
        this.public_repos = details.public_repos;
        this.followers = details.followers;

        if (details.public_repos !== null && details.followers !== null) {
            this.averageFollowers = details.followers / details.public_repos;
        }
    }

    static empty(username: string): GithubUserDetails {
        return new GithubUserDetails({
            name: null,
            login: username,
            company: null,
            public_repos: null,
            followers: null,
            averageFollowers: null
        })
    }
}