"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = void 0;
var STATUS_CODES;
(function (STATUS_CODES) {
    STATUS_CODES[STATUS_CODES["OK"] = 200] = "OK";
    STATUS_CODES[STATUS_CODES["CREATED"] = 201] = "CREATED";
    STATUS_CODES[STATUS_CODES["NO_CONTENT"] = 204] = "NO_CONTENT";
    STATUS_CODES[STATUS_CODES["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    STATUS_CODES[STATUS_CODES["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    STATUS_CODES[STATUS_CODES["FORBIDDEN"] = 403] = "FORBIDDEN";
    STATUS_CODES[STATUS_CODES["NOT_FOUND"] = 404] = "NOT_FOUND";
    STATUS_CODES[STATUS_CODES["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(STATUS_CODES || (exports.STATUS_CODES = STATUS_CODES = {}));
