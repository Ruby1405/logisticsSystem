import * as mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: Number,
    warehouseId: Number,
    products: [
        {
            productId: Number,
            quantity: Number
        }
    ],
    suborders: [Number],
    status: [
        {
            timeStamp: Date,
            WorkerId: Number
        }
    ]
});

export const Order = mongoose.model('Order', orderSchema);