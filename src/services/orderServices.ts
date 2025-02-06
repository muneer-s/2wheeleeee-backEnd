import { IOrderService } from "../interfaces/order/IOrderService";
import { IOrderRepository } from "../interfaces/order/IOrderRepository";
import { IOrder } from "../models/orderModel";
import { BikeData } from "../interfaces/BikeInterface";



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

    findBike(bikeId: string): Promise<BikeData | null> {
        try {
            const result = this.orderRepository.findBike(bikeId)
            return result
            
        } catch (error) {
            console.log("Error in order service findownerof bike",error)
            throw error
        }
    }

   

}

export default orderServices;