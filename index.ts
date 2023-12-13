import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { Generate } from './generate.ts';
import { Warehouse } from './warehouse.ts';
import * as mongoose from 'mongoose';

// Create server
const server = new Elysia();
server.use(html());

// get all warehouses with this product
async function FindProductById(id: number) {
    
    let returnList = [];
    let whCursor = Warehouse.find().cursor();
    
    // Iterate through all warehouses
    for (let doc = await whCursor.next(); doc != null; doc = await whCursor.next()) {
        
        // Create a warehouse log
        let whLog = {
            warehouseId: doc.warehouseId,
            amount: 0
        };
        
        // Iterate through all products in the warehouse
        doc.stock.forEach(element => {
            // If the product is the id matches add the quantity to the log
            if (element.productId == id) {
                whLog.amount += element?.quantity || 0;
            }
        });
        
        // If the log has a positive amount, add it to the return list
        if (whLog.amount > 0) {
            returnList.push(whLog);
        }
    }
    
    // Return the warehouses with the product
    return returnList;
};

server.use(Generate);

// First endpoint, kept for nostalgic reasons
server.get('/', () => '<h1>SALUTATIONS!</h1>');

// --------------
// DATA RETRIEVAL
// --------------
// get all warehouses with this product
server.get('/stock/products/:id', async ({ params }) => FindProductById(parseInt(params.id)));

// Start server
server.listen(8080);

// Status message
console.log("Bun Bun listenening to port 8080!");

// Connect to database
const database = "Kitty";
mongoose.connect(`mongodb+srv://${Bun.env.MONGOOSE_USERNAME}:${Bun.env.MONGOOSE_PASSWORD}@logisticssystem.1yypplx.mongodb.net/${database}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected"));