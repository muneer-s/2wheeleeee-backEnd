import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import HostServices from '../services/hostServices';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;


export class HostController {

    constructor(private HostServices: HostServices) {

    }

    async saveBikeDetails(req: Request, res: Response) {
        try {


            const updatedUserDocuments = await this.HostServices.saveBikeDetails(req,res)
            return res.status(OK).json({
                message: "Bike details saved successfully",
                data: updatedUserDocuments,
            });

        } catch (error) {
            console.log(error);

        }
    }


}

export default HostController;

