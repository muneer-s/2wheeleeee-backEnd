import { IFeedback } from "../../models/feedback";

export interface IFeedbackRepository{
    createFeedback(data:IFeedback):Promise<IFeedback>
    submittedAlready(userId:string):Promise<IFeedback | null > 
}
