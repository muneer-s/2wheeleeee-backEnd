import { IOrder } from "../../models/orderModel";

export interface IOrderService{
    saveOrder(newOrder:IOrder):Promise<IOrder>;

}
