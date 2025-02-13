import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IMessageService } from '../interfaces/message/IMessageService';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class MessageController {

    constructor(private MessageServices: IMessageService) { }


    async sendMessage(req:Request,res:Response):Promise<void>{
        try {
            const{chatId,senderId,content} = req.body
            
           const message = await this.MessageServices.sendMessage(chatId,senderId,content)
            res.json(message)
        } catch (error) {
            console.error('error while send message',error);
            
        }
    }

    async getMessage(req:Request,res:Response):Promise<void>{
        try {
            const chatId = req.query.userChatId as string
            
            const message = await this.MessageServices.getMessage(chatId)
            res.json(message)
        } catch (error) {
            console.error('error while fetching messages',error);
            
        }
    }



}

export default MessageController;

