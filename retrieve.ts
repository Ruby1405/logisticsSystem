import Elysia from "elysia";
import { Products } from './product.ts';
import { Warehouse } from './warehouse.ts';
import { Picker } from './picker.ts';
import { Chauffeur } from './chauffeur.ts';
import { Order } from './order.ts';

export const Retrieve = new Elysia({ prefix: '/retrieve' });

// --------------
// DATA RETRIEVAL
// --------------
// get all warehouses with this product
Retrieve.get('/orders/price/highest/:limit', async ({ params }) => 
    Order.find().sort({ price: -1 }).limit(parseInt(params.limit)));
// get all orders with this status
Retrieve.get('/orders/status/:status', async ({ params }) => 
    Order.find({ status: parseInt(params.status)}));
// get all chauffers who are working on a certain day and month
Retrieve.get('/chauffers/working', async ({ query }) => 
    FindWorkingChauffers(query));
// get all pickers who are currently working but don't have an assigned order
Retrieve.get('/pickers/free', async () => 
    FindFreePickers());
// general search function for orders and stock
Retrieve.get('/search/:type', ({ params, query }) => {
    switch (params.type) {
        case "orders":
            return searchOrders(query);
        case "stock":
            return searchStock(query);
        default:
            return "Invalid search parameter";
    }
});

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

async function FindWorkingChauffers(query: any) {
    // find chauffers who are working on a certain day and month and return their ids
    let chaufferList = await Chauffeur.find();
    let chaufferIds: number[] = [];
    let day = query.day? parseInt(query.day): new Date(Date.now()).getDate();
    let month = query.month? parseInt(query.month): new Date(Date.now()).getMonth();

    chaufferList.forEach(element => {
        element.schedule.forEach(shift => {
            if (shift.end && shift.start && element.workerId)
            {
                if ((shift.end.getDate() == day &&
                    shift.end.getMonth() == month) ||
                    (shift.start.getDate() == day &&
                    shift.start.getMonth() == month))
                {
                    chaufferIds.push(element.workerId);
                }
            }
        });
    });

    return chaufferIds;
}

async function FindFreePickers() {
    // find pickers who are currently working
    let pickerList = await Picker.find();
    let pickerIds: number[] = [];
    pickerList.forEach(element => {
        element.schedule.forEach(shift => {
            if (shift.end && shift.start && element.workerId)
            {
                if (shift.end > new Date(Date.now()) &&
                    shift.start < new Date(Date.now()))
                {
                    pickerIds.push(element.workerId);
                }
            }
        });
    });

    // go through each order and find the picker who is working on it and remove them from the list
    let orderCursor = Order.find().cursor();
    for (let doc = await orderCursor.next(); doc != null; doc = await orderCursor.next()) {
        if (doc.status == 1)
        {
            if (doc.statusLog[0].WorkerId)
            {
                pickerIds.splice(pickerIds.indexOf(doc.statusLog[0].WorkerId), 1);
            }
        }
    }
    return pickerIds;
}

async function searchStock(query: any) {
    if (query.id)
    {
        return await FindProductById(parseInt(query.id));
    }
}

async function searchOrders(query: any) {
    
    // Create filter object to add filters to
    let filter: object = {};
    // Create sort object to assign a sort to
    let sort = {};


    if (query.id)
    {
        filter = { ...filter, orderId: parseInt(query.id) };
    }

    if (query.status)
    {
        filter = { ...filter, status: parseInt(query.status) };
    }

    if (query.priceSort)
    {
        switch (query.priceSort)
        {
            case "lowest":
                sort = { price: 1 };
                break;
            case "highest":
                sort = { price: -1 };
                break;
        }
    }

    if (query.limit)
    {
        // If there's a timeSort the limit will be applied after the orders are found
        if (!query.timeSort)
        {
            query.limit = parseInt(query.limit);
        }
    }

    let orders = await Order.find(filter).sort(sort).limit(query.limit);

    // Post processing of the return list

    if (query.month)
    {
        let month = parseInt(query.month);
        orders = orders.filter(order => order
            .statusLog[parseInt(query.status)]
            .timeStamp?.getMonth() == month);
    }

    if (query.day)
    {
        let day = parseInt(query.day);
        orders = orders.filter(order => order
            .statusLog[parseInt(query.status)]
            .timeStamp?.getDate() == day);
    }

    if (query.timeSort)
    {
        switch (query.timeSort)
        {
            case "oldest":
                orders.sort((a, b) => a.statusLog[parseInt(query.status)]
                .timeStamp.getTime() - b.statusLog[parseInt(query.status)]
                .timeStamp.getTime());
                break;
            case "newest":
                orders.sort((a, b) => b.statusLog[parseInt(query.status)]
                .timeStamp.getTime() - a.statusLog[parseInt(query.status)]
                .timeStamp.getTime());
                break;
            default:
                break;
        }

        // Here the limit is applied
        if (query.limit)
        {
            orders = orders.slice(0, parseInt(query.limit));
        }
    }

    // If the priceSum query is true, return only the sum of the prices
    if (query.priceSum)
    {
        let sum = 0;
        orders.forEach(order => sum += order.price? order.price : 0);
        return sum;
    }
    else
    {
        return orders;
    }
}