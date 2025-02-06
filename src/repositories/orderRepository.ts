import BaseRepository from './baseRepository';
import { IOrderRepository } from '../interfaces/order/IOrderRepository';
import OrderModel, { IOrder } from '../models/orderModel';
import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';
import { error } from 'console';

class orderRepository implements IOrderRepository {

    private orderRepository: BaseRepository<IOrder>;
    private bikeRepository: BaseRepository<BikeData>;

    constructor() {
        this.orderRepository = new BaseRepository(OrderModel);
        this.bikeRepository = new BaseRepository(bikeModel)
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
    async findBike(bikeId: string): Promise<BikeData | null> {
        try {
            const bike = await this.bikeRepository.findById(bikeId)

            if(!bike){
                return null
            }
            return bike
            
        } catch (error) {
            console.log("error in order repository find bike owner",error)
            throw error
        }
    }



}

export default orderRepository;