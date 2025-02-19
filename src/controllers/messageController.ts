import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IMessageService } from '../interfaces/message/IMessageService';
import { io } from '../socket/socket';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class MessageController {

    constructor(private MessageServices: IMessageService) { }

    async sendMessage(req:Request,res:Response){
        try {
            const{chatId,senderId,content } = req.body

            if (!chatId || !senderId || !content) {
                return res.status(400).json({ error: "Invalid message data" });
            }
            
           const newMessage = await this.MessageServices.sendMessage(chatId,senderId,content)
           io.emit("message received", newMessage);
           res.json(newMessage)
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

