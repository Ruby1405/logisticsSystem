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
            // 0: queued, 1: picking (with worker), 2: picked, 3: delivering (with worker), 4: delivered
            timeStamp: Date,
            WorkerId: Number
        }
    ]
});

export const Order = mongoose.model('Order', orderSchema);