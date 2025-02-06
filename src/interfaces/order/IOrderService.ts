import { IOrder } from "../../models/orderModel";
import { BikeData } from "../BikeInterface";

export interface IOrderService{
    saveOrder(newOrder:IOrder):Promise<IOrder>;
    findBike(bikeId:string):Promise<BikeData | null>
}
