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
        let itemId = -1;
        if (assertItemExists.rowCount == 0) {
            res.status(500).json({"message": "There are no items associated with name = " + item });
            return;
        }
        itemId = assertItemExists.rows[0].id;

        // Maybe unsafe?
        console.log("INSERT INTO " + tableToAddTo + " values (" + orderId + ", " + customerId + ", " + itemId + ");");
        await db.query("INSERT INTO " + tableToAddTo + " values (" + orderId + ", " + customerId + ", " + itemId + ");");
        res.status(200).json({
            "orderId" : orderId,
            "status" : "successful insertion",
        });
    } catch (error) {
        console.error("Error adding to purchase: ", error);
        res.status(500).json({message: "An error occurred while adding to purchase."})
    }


});

module.exports = router;
