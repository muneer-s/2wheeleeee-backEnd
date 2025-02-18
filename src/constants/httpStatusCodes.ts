export enum STATUS_CODES {
    OK = 200,   // successful request.
    CREATED = 201,   // a resource has been created.
    NO_CONTENT = 204,     // a successful request with no content returned.
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,    // When authentication fails
    FORBIDDEN = 403,   // When the user is blocked by the admin.
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500 // unexpected errors.
}

// interface ErrorMessage {
//     [errorCode: number]: string
// }

// export const ERR_MESSAGE: ErrorMessage = {
//     400: 'Bad Request',
//     401: 'Unauthorized',
//     403: 'Forbidden',
//     404: 'Not Found',
//     500: 'Internal Server Error'
// }