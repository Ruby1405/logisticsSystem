import * as mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
    warehouseId: Number,
    name: String,
    stock: [{
        productId: Number,
        shelf: Number,
        quantity: Number
    }]
});

export const Warehouse = mongoose.model('Product', warehouseSchema);