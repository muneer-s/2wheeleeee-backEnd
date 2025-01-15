export enum STATUS_CODES {
    OK = 200,   // successful request.
    CREATED = 201,   // a resource has been created.
    NO_CONTENT = 204,     // a successful request with no content returned.
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,    // Authentication is required.
    FORBIDDEN = 403,   // server understood the request but refuses to authorize it.
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

interface ErrorMessage {
    [errorCode: number]: string
}

export const ERR_MESSAGE: ErrorMessage = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
}