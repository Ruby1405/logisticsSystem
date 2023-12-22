import Elysia from "elysia";
import { Products } from './product.ts';
import { Warehouse } from './warehouse.ts';
import { Picker } from './picker.ts';
import { Chauffeur } from './chauffeur.ts';
import { LogisticsSystemConfig } from './logisticsSystemConfig.ts';
import { Order } from './order.ts';
import { NameLists } from "./namelists.ts";

export const Generate = new Elysia({ prefix: '/generate' });

// ---------------
// DATA GENERATION
// ---------------
// Generate products
Generate.get('/products', async () => GenerateProducts());
// Generate warehouses
Generate.get('/warehouses/:amount', async ({ params }) => GenerateWarehouses(parseInt(params.amount)));
// Generate chauffeurs
Generate.get('/workers/chauffeurs/:amount', async ({ params }) => GenerateChauffeurs(parseInt(params.amount)));
// Generate pickers
Generate.get('/workers/pickers/:amount', async ({ params }) => GeneratePickers(parseInt(params.amount)));
// Generate orders
Generate.get('/orders/:amount', async ({ params }) => GenerateOrders(parseInt(params.amount)));
// Generate all
Generate.get('/all/:amount', async ({ params }) => {
    await GenerateProducts();
    await GenerateWarehouses(parseInt(params.amount));
    await GenerateChauffeurs(parseInt(params.amount));
    await GeneratePickers(parseInt(params.amount) * 2);
    await GenerateOrders(parseInt(params.amount) * 0.5);
});

// Number of milliseconds in an hour
const msPerHour = 3600 * 1000;
// Random integer between min and max
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);
// Current hour (Date.now() rounded down to the nearest hour)
const hourNow = () => Date.now() - (Date.now() % msPerHour);

// Generate chauffeurs
async function GenerateChauffeurs(amount: number){

    console.log("Generating chauffeurs...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextWorkerId = logisticsSystemConfig?.nextWorkerId || 0;

    // Generate chauffeurs
    for (let index = 0; index < amount; index++) {

        // Generate random name
        let firstName = "";
        if (randInt(0, 1) == 0) {
            firstName = NameLists.namesMale[randInt(0, NameLists.namesMale.length)];
        }
        else {
            firstName = NameLists.namesFemale[randInt(0, NameLists.namesFemale.length)];
        }
        let lastName = NameLists.names2[randInt(0, NameLists.names2.length)];

        // Status message
        console.log(`Creating chauffeur ${nextWorkerId} ${firstName} ${lastName}`);

        // Create chauffeur
        let chauffeur = new Chauffeur({
            name: `${firstName} ${lastName}`,
            workerId: nextWorkerId, schedule: []
        });

        // Populate schedule
        for (let j = 0; j < randInt(0, 20); j++) {
            // Start time
            let start = hourNow() + msPerHour * randInt(22, 28) * j;
            // End time
            let end = start + msPerHour * randInt(6, 8);

            chauffeur.schedule.push({
                start: new Date(start),
                end: new Date(end)
            });
        }

        // Save chauffeur
        try {
            await chauffeur.save()
                .then(() => console.log("Chauffeur saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment workerId
        nextWorkerId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextWorkerId = nextWorkerId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");
        // Create config
        try {
            await LogisticsSystemConfig.create({ nextWorkerId: nextWorkerId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all chauffeurs
    return await Chauffeur.find();
};

// Generate pickers
async function GeneratePickers(amount: number){

    console.log("Generating pickers...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextWorkerId = logisticsSystemConfig?.nextWorkerId || 0;

    // Generate pickers
    for (let index = 0; index < amount; index++) {

        // Generate random name
        let firstName = "";
        if (randInt(0, 1) == 0) {
            firstName = NameLists.namesMale[randInt(0, NameLists.namesMale.length)];
        }
        else {
            firstName = NameLists.namesFemale[randInt(0, NameLists.namesMale.length)];
        }
        let lastName = NameLists.names2[randInt(0, NameLists.names2.length)];

        console.log(`Creating picker ${nextWorkerId} ${firstName} ${lastName}`);

        // Create picker
        let picker = new Picker({
            name: `${firstName} ${lastName}`,
            workerId: nextWorkerId,
            schedule: []
        });

        // Populate schedule
        for (let j = 0; j < randInt(0, 20); j++) {
            // Start time
            let start = hourNow() + msPerHour * randInt(22, 28);
            // End time
            let end = start + msPerHour * randInt(6, 8);
            // Warehouse
            let warehouse = randInt(0, ((logisticsSystemConfig?.nextWarehouseId || 1) - 1));

            picker.schedule.push({
                start: new Date(start),
                end: new Date(end),
                wareHouse: warehouse
            });
        }

        // Save picker
        try {
            picker.save().then(() => console.log("Picker saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment workerId
        nextWorkerId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextWorkerId = nextWorkerId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");
        // Create config
        try {
            await LogisticsSystemConfig.create({ nextWorkerId: nextWorkerId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all pickers
    return await Picker.find();
};

// Generate products
async function GenerateProducts(){

    console.log("Generating products...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextProductId = logisticsSystemConfig?.nextProductId || 0;

    // Generate products
    for (let index = 0; index < NameLists.productNames1.length; index++) {

        console.log(`Creating product ${nextProductId} ${NameLists.productNames1[index]}`);

        // Create product
        try {
            await Products.create({
                name: `${NameLists.productNames1[index]}`,
                productId: nextProductId,
                weight: randInt(0, 1000),
                price: randInt(100, 1000)
            })
                .then(() => console.log("Product saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment productId
        nextProductId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextProductId = nextProductId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");

        // Create config
        try {
            await LogisticsSystemConfig.create({ nextProductId: nextProductId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all products
    return await Products.find();
};

// Generate warehouses
async function GenerateWarehouses(amount: number){

    console.log("Generating warehouses...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextWarehouseId = logisticsSystemConfig?.nextWarehouseId || 0;

    // Generate warehouses
    for (let index = 0; index < amount; index++) {

        // Generate random name
        let firstName = NameLists.warehouseNames1[randInt(0, NameLists.warehouseNames1.length)];
        let lastName = NameLists.warehouseNames2[randInt(0, NameLists.warehouseNames2.length)];

        console.log(`Creating warehouse ${nextWarehouseId} ${firstName} ${lastName}`);

        // Create warehouse
        let warehouse = new Warehouse({
            name: `${firstName} ${lastName}`,
            warehouseId: nextWarehouseId,
            stock: []
        });

        // Populate stock
        for (let j = 0; j < randInt(0, NameLists.productNames1.length); j++) {
            warehouse.stock.push({
                productId: randInt(0, (logisticsSystemConfig?.nextProductId || 1) - 1),
                shelf: j,
                quantity: randInt(0, 20)
            });
        }

        // Save warehouse
        try {
            await warehouse.save().then(() => console.log("Warehouse saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment warehouseId
        nextWarehouseId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextWarehouseId = nextWarehouseId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");
        // Create config
        try {
            await LogisticsSystemConfig.create({ nextWarehouseId: nextWarehouseId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all warehouses
    return await Warehouse.find();
};

// Generate orders
async function GenerateOrders(amount: number){

    console.log("Generating orders...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextOrderId = logisticsSystemConfig?.nextOrderId || 0;

    // Generate orders
    for (let i = 0; i < amount; i++) {

        console.log(`Creating order ${nextOrderId}`);

        // Create order
        let order: any = await Order.create({ orderId: nextOrderId, price: 0});

        // Increment orderId
        nextOrderId++;

        // Generate products
        let listOfProducts = [];
        for (let j = 0; j < randInt(0, 10); j++) {
            listOfProducts.push({
                productId: randInt(0, ((logisticsSystemConfig?.nextProductId || 1) - 1)),
                quantity: randInt(1, 10)
            });
            let productById = (await Products.findOne({ productId: listOfProducts[j].productId }));
            order.price += listOfProducts[j].quantity * (productById?.price || 0);
        }

        // Find where these products can be found
        let wareHouseSources = await pickFromWharehouses(listOfProducts);

        // If no warehouses can fulfill this order then log it and continue
        if (wareHouseSources == null) {
            console.log("order failed");
        }
        else {
            // Add the products of the first warehouse to the order
            wareHouseSources[0].demandsMet.forEach(element => {
                order.products.push({
                    productId: element.productId,
                    quantity: element.quantity
                });
            });

            // Mark the first warehouse as the warehouse of the order
            order.warehouseId = wareHouseSources[0].warehouseId;

            // If one warehouse wasn't enough to fill the order, create suborders
            if (wareHouseSources.length > 1) {

                // Iterate through the warehouses
                for (let j = 1; j < wareHouseSources.length; j++) {
                    
                    // Create suborder
                    let subOrder: any = new Order({
                        orderId: nextOrderId,
                        warehouseId: wareHouseSources[j].warehouseId,
                        mommyOrder: order.orderId,
                        price: 0
                    });

                    // Mark the suborder on the main order
                    order.suborders.push(nextOrderId);

                    // Increment orderId
                    nextOrderId++;

                    // Add the products of the warehouse to the suborder
                    wareHouseSources[j].demandsMet.forEach(async (element) => {
                        let productById = await Products.findOne({ productId: element.productId });
                        subOrder.price += element?.quantity * (productById?.price || 0);
                        subOrder.products.push({
                            productId: element.productId,
                            quantity: element.quantity
                        });
                    });

                    // Add timestamps to the suborder
                    for (let k = 0; k < randInt(0, 5); k++) {

                        // Add timestamp
                        subOrder.statusLog.push({
                            timeStamp: new Date(
                                Date.now()
                                - msPerHour * 4
                                + msPerHour * k
                                + randInt(0, msPerHour * 0.5)
                            )
                        });

                        // If the timestamp is picking
                        if (k == 1) {

                            // Find pickers that are available at this time at this warehouse
                            let possiblePickers = await Picker.find({
                                schedule: {
                                    $elemMatch: {
                                        start: { $lte: subOrder.statusLog[k].timeStamp },
                                        end: { $gte: subOrder.statusLog[k].timeStamp },
                                        wareHouse: subOrder.warehouseId
                                    }
                                }
                            });

                            // If there are pickers available assign one to the suborder
                            if (possiblePickers.length > 0) {
                                subOrder.statusLog[k].WorkerId = possiblePickers[randInt(0, (possiblePickers.length - 1))].workerId;
                            }
                            else {
                                // else log it and remove the timestamp
                                console.log("No pickers available");
                                subOrder.statusLog.pop()
                                break;
                            }
                        }

                        // If the timestamp is delivering
                        if (k == 3) {

                            // Find chauffeurs that are available at this time
                            let possibleChauffeurs = await Chauffeur.find({
                                schedule: {
                                    $elemMatch: {
                                        start: { $lte: subOrder.statusLog[k].timeStamp },
                                        end: { $gte: subOrder.statusLog[k].timeStamp }
                                    }
                                }
                            });

                            // If there are chauffeurs available assign one to the suborder
                            if (possibleChauffeurs.length > 0) {
                                subOrder.statusLog[k].WorkerId = possibleChauffeurs[randInt(0, (possibleChauffeurs.length - 1))].workerId;
                            }
                            else {
                                // else log it and remove the timestamp
                                console.log("No chauffeurs available");
                                subOrder.statusLog.pop()
                                break;
                            }
                        }
                    }
                    subOrder.status = subOrder.statusLog.length - 1;

                    // Save suborder
                    await subOrder.save()
                        .then(() => console.log("Suborder saved"));
                }

                // If there are suborders only add a queued timestamp to the main order
                order.statusLog.push({ timeStamp: new Date(Date.now()) });
            }
            else {
                // else (if there are no suborders)

                // Add timestamps
                for (let k = 0; k < Math.floor(Math.random() * 5); k++) {

                    // Add timestamp
                    order.statusLog.push({
                        timeStamp: new Date(
                            Date.now()
                            - msPerHour * 4
                            + msPerHour * k
                            + randInt(0, msPerHour * 0.5)
                        )
                    });

                    // If the timestamp is picking
                    if (k == 1) {

                        // Find pickers that are available at this time at this warehouse
                        let possiblePickers = await Picker.find({
                            schedule: {
                                $elemMatch: {
                                    start: { $lte: order.statusLog[k].timeStamp },
                                    end: { $gte: order.statusLog[k].timeStamp },
                                    wareHouse: order.warehouseId
                                }
                            }
                        });

                        // If there are pickers available assign one to the order
                        if (possiblePickers.length > 0) {
                            order.statusLog[k].WorkerId = possiblePickers[Math.floor(Math.random() * (possiblePickers.length - 1))].workerId;
                        }
                        else {
                            // else log it and remove the timestamp
                            console.log("No pickers available");
                            order.statusLog.pop()
                            break;
                        }
                    }

                    // If the timestamp is delivering
                    if (k == 3) {

                        // Find chauffeurs that are available at this time
                        let possibleChauffeurs = await Chauffeur.find({
                            schedule: {
                                $elemMatch: {
                                    start: { $lte: order.statusLog[k].timeStamp },
                                    end: { $gte: order.statusLog[k].timeStamp }
                                }
                            }
                        });

                        // If there are chauffeurs available assign one to the order
                        if (possibleChauffeurs.length > 0) {
                            order.statusLog[k].WorkerId = possibleChauffeurs[Math.floor(Math.random() * (possibleChauffeurs.length - 1))].workerId;
                        }
                        else {
                            // else log it and remove the timestamp
                            console.log("No chauffeurs available");
                            order.statusLog.pop()
                            break;
                        }
                    }
                }
                order.status = order.statusLog.length - 1;
            }
        }

        // Save order
        await order.save().then(() => console.log("Order saved"));
    }

    // Update config values
    if (logisticsSystemConfig != null) {

        logisticsSystemConfig.nextOrderId = nextOrderId;

        await logisticsSystemConfig.save().then(() =>
            console.log("LogisticsSystemConfig saved"));

    }
    else {

        console.log("LogisticsSystemConfig is null");

        // Create config
        try {
            await LogisticsSystemConfig.create({ nextOrderId: nextOrderId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all orders
    return await Order.find();
};

// Find warehouses that have these products
async function pickFromWharehouses(
    listOfProducts: { productId: number, quantity: number }[]
) {

    // Total amount of products
    let totalAmount = 0;
    listOfProducts.forEach(element => {
        totalAmount += element.quantity;
    });

    // Highest % of order completion
    let bestScore = 0;

    // Id of the best warehouse
    let bestWarehouse = 0;

    // Return value
    let returnList = [];

    // Demands met by this warehouse
    let demandsMet = [];

    // Demands left after this warehouse
    let demandsLeft = [];

    // Iterate through all warehouses
    let whCursor = await Warehouse.find().cursor();
    for (let doc = await whCursor.next(); doc != null; doc = await whCursor.next()) {

        // Create a list of demands
        let demands = structuredClone(listOfProducts);

        // Iterate through the demands
        demands.forEach(requestedProduct => {

            // Iterate through the stock
            for (let i = 0; i < doc.stock.length; i++) {

                // If the id matches subtract the quantity from the demand
                if (doc.stock[i].productId == requestedProduct.productId) {
                    requestedProduct.quantity -= doc.stock[i]?.quantity || 0;
                }
                if (requestedProduct.quantity <= 0) {
                    requestedProduct.quantity = 0;
                    break;
                }
            };
        });

        // Calculate the % of order completion
        let sum = 0;
        demands.forEach(requestedProduct => {
            sum += requestedProduct.quantity;
        });

        // If this warehouse has a higher % of order completion than the best
        if (1 - (sum / totalAmount) > bestScore) {

            // Update the best id to this warehouse
            bestWarehouse = doc?.warehouseId || 0;

            // Update the demands left and met and the score
            demandsMet = [];
            demandsLeft = [];
            bestScore = 1 - (sum / totalAmount);

            for (let i = 0; i < listOfProducts.length; i++) {
                // If the demand for a certain product is now less than the initial demand mark off that amount as met
                if (demands[i].quantity < listOfProducts[i].quantity) {
                    demandsMet.push({
                        productId: listOfProducts[i].productId,
                        quantity: listOfProducts[i].quantity - demands[i].quantity
                    });
                }
                // If the demand for a certain product is not 0 add it to the demands left
                if (demands[i].quantity > 0) {
                    demandsLeft.push(demands[i]);
                }
            }
        }

        // If the score is 0 then this warehouse is of no use
        if (sum / totalAmount == 0) {
            break;
        }
    }

    // If the score of the best warehouse is 0 then no warehouse can fulfill this order
    if (bestScore == 0) {
        console.log("No warehouses can fulfill this order");
        return null;
    } else {

        // After finding the best warehouse, remove the products from the stock
        let warehouse: any = await Warehouse.findOne({ warehouseId: bestWarehouse });
        let productsToRemove = demandsMet;

        productsToRemove.forEach(removeElement => {
            if (warehouse != undefined) {
                for (let i = 0; i < warehouse.stock.length || 0; i++) {
                    if (warehouse.stock[i].productId == removeElement.productId &&
                        warehouse.stock[i].quantity != null) {

                        if (warehouse.stock[i].quantity < removeElement.quantity) {
                            removeElement.quantity -= warehouse.stock[i].quantity;
                            warehouse.stock[i].quantity = 0;
                        }
                        else {
                            warehouse.stock[i].quantity -= removeElement.quantity;
                        }
                    }
                }
            }
        });

        // Save the demands that were met to the return list
        returnList.push({
            warehouseId: bestWarehouse,
            demandsMet: demandsMet
        });

        // If there are still demands left, call this function again with the demands left
        if (bestScore < 1) {

            let wareHouseSources = await pickFromWharehouses(demandsLeft);

            if (wareHouseSources != null) {
                // Add the demands met by other warehouses to the return list
                wareHouseSources.forEach(element => returnList.push(element));
            }
            else {
                // ---
                // BUG
                // ---
                // If this happens then the order could not be fulfilled but products were still removed from the stock
                return null;
            }
        }
    }

    // Return the return list
    return returnList;
}