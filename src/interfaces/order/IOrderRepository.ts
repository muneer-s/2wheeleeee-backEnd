import { IOrder } from "../../models/orderModel";

export interface IOrderRepository {
    saveOrder(newOrder:IOrder):Promise<IOrder>;
}
