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