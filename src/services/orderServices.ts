import { IOrderService } from "../interfaces/order/IOrderService";
import { IOrderRepository } from "../interfaces/order/IOrderRepository";
import { IOrder } from "../models/orderModel";



class orderServices implements IOrderService {
    constructor(private orderRepository: IOrderRepository) { }

    async saveOrder(newOrder: IOrder): Promise<IOrder> {
        try {
            const result = this.orderRepository.saveOrder(newOrder)
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}

export default orderServices;