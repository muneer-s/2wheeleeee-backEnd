import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IChatService } from '../interfaces/chat/IChatService';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class ChatController {

    constructor(private ChatServices: IChatService) { }

    
    async accessChat(req:Request,res:Response):Promise<void> {
        try {
            const {receiverId,senderId} = req.body            
            const chat = await this.ChatServices.accessChat(receiverId,senderId)
            res.json(chat)
        } catch (error) {
            console.error('error in creating chat room',error);
        }
    }

    async getChat(req:Request,res:Response):Promise<void> {
        try {             
            const userId = req.query.userId as string            
            const messages = await this.ChatServices.getChat(userId)                        
            res.json(messages)
        } catch (error) {
            console.error('erron while fetching message details',error);
        }
    } 

   



}

export default ChatController;

