import { IFeedback } from "../../models/feedback";

export interface IFeedbackServices{
    createFeedback(data:IFeedback):Promise<IFeedback>
    submittedAlready(userId:string):Promise<IFeedback | null>
}
