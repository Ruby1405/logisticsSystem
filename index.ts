import { Elysia } from 'elysia';
import * as mongoose from 'mongoose';
import { html } from '@elysiajs/html';
import { Products } from './product.ts';
import { Warehouse } from './warehouse.ts';

const server = new Elysia();

server.use(html());

server.get('/', () => '<h1>SALUTATIONS!</h1>');

server.get('/currentWorkers', (date) => {
    let currentWorkers = [];
    for (let i = 0; i < 10; i++) {
        currentWorkers.push({
            id: i,
            name: `Worker ${i}`,
        });
    }
    return currentWorkers;
});

server.get('stock/products/:id', async ({params}) => {
    let listOfProducts = [];
    let whCursor = Warehouse.find().cursor();
    for (let doc = await whCursor.next(); doc != null; doc = await whCursor.next()) {
        let whLog = {
            warehouseId: doc.warehouseId,
            amount: 0
        };
        doc.stock.forEach(element => {
            if (element.productId == parseInt(params.id)) {
                whLog.amount += element?.quantity || 0;
            }
        });
        listOfProducts.push(whLog);
    }
    return listOfProducts;
});

// If all stocked products are in their own collection and know their warehouseId
// server.get('stock/products/:id', async ({params}) => {
//     let response = {};
//     let listOfProducts = StockProducts.find({productId: parseInt(params.id)});
//     listOfProducts.forEach(element => {
//         response[`element.warehouseId`] += element.quantity;
//     });
//     return response;
// });

server.listen(8080);

console.log("Bun Bun listenening to port 8080!");

mongoose.connect(`mongodb+srv://${Bun.env.MONGOOSE_USERNAME}:${Bun.env.MONGOOSE_PASSWORD}@logisticssystem.1yypplx.mongodb.net/?retryWrites=true&w=majority`).then(() => console.log("Connected"));