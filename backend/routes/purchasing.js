const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require('../db');
router.use(express.json());

router.post('/finalizePurchase', async (req, res) => {

    try {
        const { orderId, isActuallyOrdering } = req.body;
        const getFromTableQuery = (table, item) => "SELECT " + item + " FROM " + table + " WHERE order_id = " + orderId + ';';
        const deleteFromTable = table => "DELETE FROM " + table + " WHERE order_id = " + orderId + ';';

        const active_items = await db.query(getFromTableQuery("active_items", "item"));
        const active_amounts = await db.query(getFromTableQuery("active_amounts", "amounts"));
        const active_high_level_items = await db.query(getFromTableQuery("active_high_level_items", "high_item"));

        if (active_items.rowCount == 0 || 
            active_items.rowCount != active_amounts.rowCount) {
                res.status(500).json({message: "You either have no items for this given orderId or the database does not have accurate counts"});
            }
        else {
            if (isActuallyOrdering == true) {
                // We need to send to customer_purchase_log, and update inventory

                
                for (let i = 0; i < active_items.rowCount; i++) {
                    // Get each ingredient's junction table stuff
                    const getIngredientsOfItemQuery = "SELECT * FROM menu_to_ingredients where menu_id = " + active_items.at(i) + ";";
                    const active_ingredients = await db.query(getIngredientsOfItemQuery);

                    for (let j = 0; j < active_ingredients.rowCount; j++) {
                        await db.execute("")
                    }
                }




            }
            // Clear from active purcahse
            await db.post(deleteFromTable("active_items"));
            await db.post(deleteFromTable("active_amounts"));
            await db.post(deleteFromTable("active_high_level_items"));
        }

    } catch (error) {
        console.error("Error finalizing purchase:", error);
        res.status(500).json({ message: "An error occurred while finalizing purchase." });
    }

});

module.exports = router;
