import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface IOrder extends Document {
    orderId: string,
    bikeId: ObjectId;
    amount: number;
    startDate: Date;
    endDate: Date;
    userId: ObjectId;
    method: string;
    status: string;
}

const orderSchema: Schema<IOrder> = new mongoose.Schema({
    orderId: {
        type: String,
        requried: true
    },
    bikeId: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

const OrderModel = mongoose.model<IOrder>('Order', orderSchema)

export default OrderModel