import BaseRepository from './baseRepository';
import { IOrderRepository } from '../interfaces/order/IOrderRepository';
import OrderModel, { IOrder } from '../models/orderModel';

class orderRepository implements IOrderRepository {

    private orderRepository: BaseRepository<IOrder>;

    constructor() {
        this.orderRepository = new BaseRepository(OrderModel);
    }
    
    async saveOrder(newOrder: IOrder): Promise<IOrder> {
        try {
            const Order = await this.orderRepository.create(newOrder)
            return Order;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }



}

export default orderRepository;