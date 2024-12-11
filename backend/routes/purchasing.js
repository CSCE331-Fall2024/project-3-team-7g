const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());



/**
 * Handles Completing purchases with HTTP POST request to "/routes/purchasing/finalizePurchase" endpoint.
 * 
 * @name post/finalizePurchase
 * @function backend/purchasing/finalizePurchase
 * @param {express.Request} req - JSON containing purchase information
 * @param {string} req.body.userEmail - The email of the user completing purchase
 * @param {string} req.body.cashOrCard - 'Cash' or 'Card' for payment method
 * @param {boolean} req.body.isActuallyOrdering - determines whether the user completes ordering. finalizePurchase doubles as a cancel purchase function.
 * @param {string} req.body.timeOfPurchase - time of request, formatted as "YYYY-MM-DD HH:MM:SS"
 * @param {express.Response} res - Response from server. 200 for success, 500 for incorrect argument(s).
 */
router.post('/finalizePurchase', async (req, res) => {

    try {

        
        let total = 0;
        const {userEmail, cashOrCard, isActuallyOrdering, timeOfPurchase} = req.body;
        const getCustomerId = await db.query("SELECT * FROM users WHERE email = '" + userEmail + "';");
        if (getCustomerId.rowCount == 0) {
            res.status(500).json({message: "User does not exist in database"});
            return;
        }
        const customerId = getCustomerId.rows[0].user_id;
        const getOrderId = await db.query("SELECT order_id FROM active_orders where user_id = " + customerId);
        const orderId = getOrderId.rows[0].order_id;

        if (orderId == undefined || customerId == undefined || cashOrCard == undefined || isActuallyOrdering == undefined) {
            res.status(500).json({message: "All arguments are not given yet"});
            return;
        }

        
        const getFromTableQuery = (table, item) => "SELECT " + item + " FROM " + table + " WHERE order_id = " + orderId + ';';
        const deleteFromTable = table => "DELETE FROM " + table + " WHERE order_id = " + orderId + ';';


        if (isActuallyOrdering == false) {
            await db.query(deleteFromTable("active_items"));
            await db.query(deleteFromTable("active_high_level_items"));
            res.status(200).json({message: "Successfully cleared purchase."});
            return;
        }

        const active_items = await db.query(getFromTableQuery("active_items", "item"));
        const active_high_level_items = await db.query(getFromTableQuery("active_high_level_items", "high_item"));


        if (cashOrCard != "Cash" && cashOrCard != "Card") {
            res.status(500).json({message: "cashOrCard must be Cash or Card"});
            return;
        }
        else if (active_high_level_items.rowCount == 0 || active_items.rowCount == 0) {
                res.status(500).json({message: "You either have no items for this given orderId or the database does not have accurate counts"});
                return;
            }
        else {
            
            
            if (isActuallyOrdering == true) {
                // We need to send to customer_purchase_log, and update inventory
                for (let i = 0; i < active_items.rowCount; i++) {
                    // Get each ingredient's junction table stuff

                    const getIngredientsOfItemQuery = "SELECT * FROM menu_to_ingredients where menu_id = " + active_items.rows[i].item + ";";
                    const active_ingredients = await db.query(getIngredientsOfItemQuery);
                    
                    const menu_sales_query = "INSERT INTO menu_sales values (" + active_items.rows[i].item + ", 1, '" + timeOfPurchase + "');";
                    console.log(menu_sales_query)
                    await db.query(menu_sales_query)                    
                    for (let j = 0; j < active_ingredients.rowCount; j++) {
                        const updateInventoryComm = "UPDATE inventory SET AMOUNT = AMOUNT - 1 WHERE id = " +active_ingredients.rows[j].ingredient_id + ";";
                        await db.query(updateInventoryComm);
                    }
                }
                for(let i = 0; i < active_high_level_items.rowCount; i++) {
                    const addToTotalQuery = "SELECT price FROM menu_pricing WHERE id = " + active_high_level_items.rows[i].high_item;
                    const resp = await db.query(addToTotalQuery);
                    total += resp.rows[0].price;
                }
                const currentTime = timeOfPurchase;
                console.log("INSERT INTO customer_purchase_log VALUES (" + orderId + ", " + customerId + ", " + total + ", '" + currentTime + "', '"  + cashOrCard + "');");
                await db.query("INSERT INTO customer_purchase_log VALUES (" + orderId + ", " + customerId + ", " + total + ", '" + currentTime + "', '"  + cashOrCard + "');");
                await db.query("DELETE FROM active_orders where user_id =" + customerId);
            }
            // Clear from active purcahse
            await db.query(deleteFromTable("active_items"));
            await db.query(deleteFromTable("active_high_level_items"));
        }

        res.status(200).json({
            "orderId" : orderId,
            "status" : "Complete, " +  isActuallyOrdering ? "Sent to customerPurchaseLog" : "Refunded",
            "Total Cost" : total 
        });

    } catch (error) {
        console.error("Error finalizing purchase:", error);
        res.status(500).json({ message: "An error occurred while finalizing purchase." });
    }
    
});

/**
 * Handles adding to purchases with HTTP POST request to "/routes/purchasing/addToPurchase" endpoint.
 * 
 * @name post/addToPurchase
 * @function backend/purchasing/addToPurchase
 * @param {express.Request} req - JSON containing purchase information
 * @param {string} req.body.userEmail - The email of the user adding to their purchase
 * @param {int} req.body.type - Type of addition: "highItem", "item",
 * @param {int} req.body.item - determines whether the user completes ordering. finalizePurchase doubles as a cancel purchase function.
 * @param {express.Response} res - Response from server. 200 for success, 500 for incorrect argument(s).
 * @description Adds an item to a users purchase, given their email. If successful, it will return the user id as well as a message stating that the add was successful. If there was a failure, it will return the reason the addition failed.
 */
router.post('/addToPurchase', async (req, res) => {
    try {
        // const {type, orderId, customerId, item} = req.body;
        // Put back once we fully implement it
        const {userEmail, type, item} = req.body;
        const getCustomerId = await db.query("SELECT * FROM users WHERE email = '" + userEmail + "';");
        if (getCustomerId.rowCount == 0) {
            res.status(500).json({message: "User does not exist in database"});
            return;
        }
        const customerId = getCustomerId.rows[0].user_id;
        const getOrderId = await db.query("SELECT order_id FROM active_orders where user_id = " + customerId);

        let orderId = -1;
        if (getOrderId.rowCount == 0) { // User does not have a pending order yet
            const getCompletedOrderCount = await db.query("SELECT COUNT(*) FROM customer_purchase_log");
            const completedOrders = getCompletedOrderCount.rows[0].count;
            const getActiveOrderCount = await db.query("SELECT COUNT(*) FROM active_orders");
            const activeOrders = getActiveOrderCount.rows[0].count;

            orderId = completedOrders + activeOrders;

            await db.query("INSERT INTO active_orders VALUES (" + orderId + ", " + customerId + ");");
        }
        else {
            orderId = getOrderId.rows[0].order_id;
        }

        let verifyingTable = "";
        let tableToAddTo = "";

        switch (type) {
            case "highItem":
                verifyingTable = "menu_pricing";
                tableToAddTo = "active_high_level_items";
                break;
            case "item":
                verifyingTable = "menu";
                tableToAddTo = "active_items";
                break;
            case "amount":
                // DO nothing to verify here (maybe change this at some point?)
                // const itemCounterQuery = await db.query("SELECT COUNT(*) FROM active_amounts WHERE order_id = " + orderId)
                // const itemCountInOrder = itemCounterQuery.rows[0].count;

                await db.query("INSERT INTO active_amounts values (" + orderId + ", " + customerId + ", " + item + ");");
                res.status(200).json({
                    "orderId" : orderId,
                    "status" : "successful insertion",
                });
                return;
            default:
                res.status(500).json({"message": "type does not exist: " + type});
                return;
        }
        const assertItemExists = await db.query("SELECT * FROM " + verifyingTable + " WHERE name = '" + item + "'");
        if (assertItemExists.rowCount == 0) {
            res.status(500).json({"message": "There are no items associated with name = " + item });
            return;
        }
        const itemId = assertItemExists.rows[0].id;
        
        const itemCounterQuery = await db.query("SELECT COUNT(*) FROM " + tableToAddTo + " WHERE order_id = " + orderId)
        const itemCountInOrder = itemCounterQuery.rows[0].count;

        // Maybe unsafe?
        console.log("INSERT INTO " + tableToAddTo + " values (" + orderId + ", " + customerId + ", " + itemId + ", " + itemCountInOrder + ");");
        await db.query("INSERT INTO " + tableToAddTo + " values (" + orderId + ", " + customerId + ", " + itemId + ", " + itemCountInOrder + ");");
        res.status(200).json({
            "orderId" : Number(orderId),
            "message" : "successful insertion",
        });
    } catch (error) {
        console.error("Error adding to purchase: ", error);
        res.status(500).json({message: "An error occurred while adding to purchase."})
    }


});


/**
 * Handles getting order details with HTTP GET request to "/routes/purchasing/getOrderDetails/" endpoint.
 * 
 * @name get/addToPurchase
 * @function backend/purchasing/getOrderDetails/:email
 * @param {string} :email - user email to grab details from.
 * @param {express.Response} res - Response from server. 200 for success, 500 for incorrect argument(s).
 * @description On success, it will return a JSON list of items that specify the user's purchase information. View Source code to see specific differences in items (Plate vs. Bowl vs. Drink).
 */
router.get('/getOrderDetails/:email', async (req, res) => {
    try {
    
        let total = 0;
        const email = req.params.email;
        const getCustomerId = await db.query("SELECT * FROM users WHERE email = '" + email + "';");
        const customerId = getCustomerId.rows[0].user_id
        // PUT THIS BACK LATER //////////////////////////////////
        const highLevelItems = [];

        const getFromTableQuery = (table) => "SELECT * FROM " + table + " WHERE customer_id = " + customerId + ' ORDER BY item_counter_per_order;';
        const getActiveItems = await db.query(getFromTableQuery("active_items", "item"));
        const activeItems = getActiveItems.rows;

        //const active_amounts = await db.query(getFromTableQuery("active_amounts", "amounts"));
        const getActiveHighLevelItems = await db.query(getFromTableQuery("active_high_level_items", "high_item"));
        const activeHighLevelItems = getActiveHighLevelItems.rows;
        let lowLevelPointer = 0;

        const getLowLevelList = await db.query("SELECT * FROM menu ORDER BY id");
        const lowLevelList = getLowLevelList.rows;
        const getHighLevelList = await db.query("SELECT * FROM menu_pricing ORDER BY id");
        const highLevelList = getHighLevelList.rows;

        for (let i = 0; i < getActiveHighLevelItems.rowCount; i++) {
            // Hard coded bit to determine what type of high level item it is. If we have the time to, we can make a junction table that expects certain items
            const highItem = activeHighLevelItems[i];
            const name = highLevelList[highItem.high_item].name;
            const price = highLevelList[highItem.high_item].price;
            total += price;
            // console.log(name + " " + price);
            const addItemsToArray = (arr, count) => {
                for (itemIndex = 0; itemIndex < count; itemIndex++) {
                    let itemId = activeItems[lowLevelPointer].item;
                    let itemName = lowLevelList[itemId].name;
                    lowLevelPointer++;
                    arr.push(itemName);
                }
            }

            switch (name) {
                case "Bowl":
                    // Expecting a side and an entree
                    var items = [];
                    addItemsToArray(items, 2);
                    var highLevelItem = {
                        "Name" : name,
                        "Side 1": items[0],
                        "Entree 1": items[1],
                        "Price" : price
                    };
                    console.log(highLevelItem);
                    highLevelItems.push(highLevelItem);
                    break;
                case "Plate":
                    // Expecting a side and two entrees
                    var items = [];
                    addItemsToArray(items, 3);
                    var highLevelItem = {
                        "Name" : name,
                        "Side 1": items[0],
                        "Entree 1": items[1],
                        "Entree 2": items[2],
                        "Price" : price
                    };
                    console.log(highLevelItem);
                    highLevelItems.push(highLevelItem);
                    break;
                case "Bigger Plate":
                    // Expecting a side and three entrees
                    var items = [];
                    addItemsToArray(items, 4);
                    var highLevelItem = {
                        "Name" : name,
                        "Side 1": items[0],
                        "Entree 1": items[1],
                        "Entree 2": items[2],
                        "Entree 3": items[3],
                        "Price" : price
                    };
                    console.log(highLevelItem);
                    highLevelItems.push(highLevelItem);
                    break;
                case "A La Carte":
                    // Expecting one entree
                    var items = [];
                    addItemsToArray(items, 1);
                    var highLevelItem = {
                        "Name" : name,
                        "Entree 1": items[0],
                        "Price" : price
                    };
                    console.log(highLevelItem);
                    highLevelItems.push(highLevelItem);
                    break;
                case "Appetizer":
                    // Expecting one appetizer
                    var items = [];
                    addItemsToArray(items, 1);
                    var highLevelItem = {
                        "Name" : name,
                        "Appetizer": items[0],
                        "Price" : price
                    };
                    console.log(highLevelItem);
                    highLevelItems.push(highLevelItem);
                    break;
                case "Drink":
                    // Expecting one drink
                    var items = [];
                    addItemsToArray(items, 1);
                    var highLevelItem = {
                        "Name" : name,
                        "Drink": items[0],
                        "Price" : price
                    };
                    console.log(highLevelItem);
                    highLevelItems.push(highLevelItem);
                    
                    break;
            }
        }

        const returnVal = {
            "customerId" : Number(customerId),
            "highLevelItems" : highLevelItems,
            "total" : total
        }

        res.json(returnVal);

    } catch(error) { 
        console.error("Error retrieving hourly sales data:", error); 
        res.status(500).json({ message: "An error occurred while fetching this order." }); 
    } 


});


module.exports = router;
