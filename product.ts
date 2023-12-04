import * as mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: Number,
    name: String,
    price: Number,
    weight: Number
});

export const Products = mongoose.model('Product', productSchema);