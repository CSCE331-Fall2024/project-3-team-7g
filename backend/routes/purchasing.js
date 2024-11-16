const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());

/**
 * finalize purchase params:
 * orderId - orderId of purchase you want to finalize
 * isActuallyOrdering - boolean stating whether you want to send the purchase to
 *  completed purchase tables
 */
router.post('/finalizePurchase', async (req, res) => {

    try {
        let total = 0;
        const { orderId, isActuallyOrdering } = req.body;
        const getFromTableQuery = (table, item) => "SELECT " + item + " FROM " + table + " WHERE order_id = " + orderId + ';';
        const deleteFromTable = table => "DELETE FROM " + table + " WHERE order_id = " + orderId + ';';

        const active_items = await db.query(getFromTableQuery("active_items", "item"));
        const active_amounts = await db.query(getFromTableQuery("active_amounts", "amounts"));
        const active_high_level_items = await db.query(getFromTableQuery("active_high_level_items", "high_item"));

        if (active_high_level_items.rowCount == 0 || active_items.rowCount == 0 ||
            active_items.rowCount != active_amounts.rowCount) {
                res.status(500).json({message: "You either have no items for this given orderId or the database does not have accurate counts"});
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
            }
            // Clear from active purcahse
            await db.query(deleteFromTable("active_items"));
            await db.query(deleteFromTable("active_amounts"));
            await db.query(deleteFromTable("active_high_level_items"));
        }
        // TODO: Add to customer_purchase_log


        res.status(200).json({
            "orderId" : orderId,
            "status" : "Complete",
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
        const {type, orderId, customerId, item} = req.body;
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
        const assertItemExists = await db.query("SELECT * FROM " + verifyingTable + " WHERE id = " + item);
        if (assertItemExists.rowCount == 0) {
            res.status(500).json({"message": "There are no items associated with id = " + item});
            return;
        }
        // Maybe unsafe?
        await db.query("INSERT INTO " + tableToAddTo + " values (" + orderId + ", " + customerId + ", " + item + ");");
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
