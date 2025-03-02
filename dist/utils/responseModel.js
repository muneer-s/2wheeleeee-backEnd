"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
class ResponseModel {
    static success(message, data) {
        return {
            success: true,
            message,
            data,
        };
    }
    static error(message, error) {
        return {
            success: false,
            message,
            error,
        };
    }
}
exports.ResponseModel = ResponseModel;
