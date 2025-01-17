import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import HostServices from '../services/hostServices';


const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;


export class HostController {

    constructor(private HostServices: HostServices) { }

    async saveBikeDetails(req: Request, res: Response) {
        try {
            const { insuranceExpDate, polutionExpDate } = req.body;

            if (!insuranceExpDate || !polutionExpDate) {
                return res.status(BAD_REQUEST).json({ message: "Insurance and Pollution expiration dates are required." });
            }

            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

            if (new Date(insuranceExpDate) <= sixMonthsFromNow || new Date(polutionExpDate) <= sixMonthsFromNow) {
                return res.status(BAD_REQUEST).json({ message: "Insurance and Pollution expiration dates must be greater than six months from today's date." });
            }
            const updatedUserDocuments = await this.HostServices.saveBikeDetails(req, res)

            return res.status(OK).json({ message: "Bike details saved successfully", data: updatedUserDocuments });

        } catch (error) {
            console.log(error);

        }
    }

    async isAdminVerifyUser(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string
            const findUser = await this.HostServices.isAdminVerifyUser(userId)
            return res.status(OK).json({ success: true, user: findUser })

        } catch (error) {
            console.log(error);

        }
    }

    async fetchBikeData(req: Request, res: Response) {
        try {

            const { userId } = req.query

            if (!userId) {
                return res.status(BAD_REQUEST).json({ success: false, message: "User ID is required" });
            }

            const findUserAndBikes = await this.HostServices.fetchBikeData(userId as string)

            return res.status(OK).json({ success: true, userAndbikes: findUserAndBikes })
        } catch (error) {
            console.error("Error fetching bike data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch bike data" });
        }
    }

    async bikeSingleView(req: Request, res: Response) {
        try {
            const bikeId = req.query.bikeId
            console.log(111, bikeId);
            if (!bikeId) {
                return res.status(BAD_REQUEST).json({ success: false, message: "Bike Id is required" })
            }

            const findBike = await this.HostServices.bikeSingleView(bikeId as string)
            return res.status(OK).json({ success: true, bike: findBike })
        } catch (error) {
            console.error("Error fetching single bike  data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch single bike data" });
        }
    }


    async deleteBike(req: Request, res: Response) {
        try {
            const bikeId = req.query.bikeId

            if (!bikeId) {
                return res.status(BAD_REQUEST).json({ success: false, message: "Bike Id is required" })
            }
            const bike = await this.HostServices.deleteBike(bikeId as string)
            return res.status(OK).json({ success: true })

        } catch (error) {
            console.error("Error deleting bike  data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete  bike data" });
        }
    }

    async editBike(req: Request, res: Response) {
        try {
            const { bikeId } = req.query;
            
            if (!bikeId) {
                return res.status(BAD_REQUEST).json({ success: false, message: "Bike ID is required." });
            }

            const bike = await this.HostServices.editBike(req, res)
            return res.status(OK).json({ success: true, bike });
            
        } catch (error) {
            console.error("Error editing bike  data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to editing  bike data" });
        }
    }


}

export default HostController;

