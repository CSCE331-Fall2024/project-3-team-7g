const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * finalize purchase params:
 * orderId - orderId of purchase you want to finalize
 * customerId
 * cashOrCard - Describes payment method
 * isActuallyOrdering - boolean stating whether you want to send the purchase to
 *  completed purchase tables
 */
router.post('/finalizePurchase', async (req, res) => {

    try {

        
        let total = 0;

        // const { orderId, customerId, cashOrCard, isActuallyOrdering } = req.body;
        // Put back once we implement this
        const {cashOrCard, isActuallyOrdering} = req.body;
        const getOrderId = await db.query("SELECT MAX(orderid) FROM customer_purchase_log;");
        const orderId = getOrderId.rows[0].max + 1;
        const customerId = 2026;

        if (orderId == undefined || customerId == undefined || cashOrCard == undefined || isActuallyOrdering == undefined) {
            res.status(500).json({message: "All arguments are not given yet"});
        }

        
        const getFromTableQuery = (table, item) => "SELECT " + item + " FROM " + table + " WHERE order_id = " + orderId + ';';
        const deleteFromTable = table => "DELETE FROM " + table + " WHERE order_id = " + orderId + ';';

        const active_items = await db.query(getFromTableQuery("active_items", "item"));
        const active_amounts = await db.query(getFromTableQuery("active_amounts", "amounts"));
        const active_high_level_items = await db.query(getFromTableQuery("active_high_level_items", "high_item"));


        if (cashOrCard != "Cash" && cashOrCard != "Card") {
            res.status(500).json({message: "cashOrCard must be Cash or Card"});
            return;
        }
        else if (active_high_level_items.rowCount == 0 || active_items.rowCount == 0 ||
            active_items.rowCount != active_amounts.rowCount) {
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
                    
                    for (let j = 0; j < active_ingredients.rowCount; j++) {
                        const updateInventoryComm = "UPDATE inventory SET AMOUNT = AMOUNT - " + active_amounts.rows[i].amounts + " WHERE id = " +active_ingredients.rows[j].ingredient_id + ";";
                        await db.query(updateInventoryComm);
                    }
                }
                for(let i = 0; i < active_high_level_items.rowCount; i++) {
                    const addToTotalQuery = "SELECT price FROM menu_pricing WHERE id = " + active_high_level_items.rows[i].high_item;
                    const resp = await db.query(addToTotalQuery);
                    total += resp.rows[0].price;
                }
                // TODO: Add to customer_purchase_log
                const currentTime = getCurrentDateTime();
                console.log("INSERT INTO customer_purchase_log VALUES (" + orderId + ", " + customerId + ", " + total + ", '" + currentTime + "', '"  + cashOrCard + "');");
                await db.query("INSERT INTO customer_purchase_log VALUES (" + orderId + ", " + customerId + ", " + total + ", '" + currentTime + "', '"  + cashOrCard + "');");
            }
            // Clear from active purcahse
            await db.query(deleteFromTable("active_items"));
            await db.query(deleteFromTable("active_amounts"));
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
 * addToPurchase params
 * type - type of thing we want to add to database. Either highItem, item, or amount
 * orderId
 * customerId
 * item
 */
router.post('/addToPurchase', async (req, res) => {
    try {
        // const {type, orderId, customerId, item} = req.body;
        // Put back once we fully implement it
        const {type, item} = req.body;
        const getOrderId = await db.query("SELECT MAX(orderid) FROM customer_purchase_log;");
        const orderId = getOrderId.rows[0].max + 1;
        const customerId = 2026;


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
                const itemCounterQuery = await db.query("SELECT COUNT(*) FROM active_amounts WHERE order_id = " + orderId)
                const itemCountInOrder = itemCounterQuery.rows[0].count;

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
            "orderId" : orderId,
            "status" : "successful insertion",
        });
    } catch (error) {
        console.error("Error adding to purchase: ", error);
        res.status(500).json({message: "An error occurred while adding to purchase."})
    }


});

router.get('/getOrderDetails/:orderId', async (req, res) => {
    try {
    
        let total = 0;
        // const orderId = req.params.orderId;
        // PUT THIS BACK LATER //////////////////////////////////
        const highLevelItems = [];

        const getOrderId = await db.query("SELECT MAX(orderid) FROM customer_purchase_log;");
        const orderId = getOrderId.rows[0].max + 1;

        const getFromTableQuery = (table) => "SELECT * FROM " + table + " WHERE order_id = " + orderId + ' ORDER BY item_counter_per_order;';
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
            "orderId" : orderId,
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
