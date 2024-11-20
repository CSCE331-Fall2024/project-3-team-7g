const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require("../db")

router.use(express.json());



router.post('/addInventoryItem', async (req, res) => {
    const { name, amount } = req.body;

    const idResult = await db.query("SELECT MAX(id) AS highest_id FROM menu");
    const highestId = idResult.rows[0].highest_id || 0;
    const id = highestId + 1;

    const insertQuery = "INSERT INTO inventory (id, name, amount) VALUES ($1, $2, $3)";
    const updateResult = await db.query(insertQuery, [id, name, amount]);


    if (updateResult.rowCount > 0) {
        res.json({ message: `Successfully added ${name} with an amount of ${amount}` });
    } else {
        res.status(500).json({ message: "Something went wrong while adding the item" });
    }
}
);

router.post('/addMenuItem', async (req, res) => {
    const { itemName, itemType } = req.body;

    const idResult = await db.query("SELECT MAX(id) AS highest_id FROM menu");
    const highestId = idResult.rows[0].highest_id || 0;
    const id = highestId + 1;

    const insertQuery = "INSERT INTO menu (id, name, type) VALUES ($1, $2, $3)";
    const updateResult = await db.query(insertQuery, [id, itemName, itemType]);


    if (updateResult.rowCount > 0) {
        res.json({ message: `Successfully added ${itemName} as ${itemType}` });
    } else {
        res.status(500).json({ message: "Something went wrong while adding the item" });
    }
}
);

router.post('/addQuantity', async (req, res) => {
    const { name, amount } = req.body;

    const query = 'SELECT amount FROM inventory WHERE name = $1';
    const result = await db.query(query, [name]);

        if (result.rows.length > 0) {
            // Ingredient exists, so update
            const updateQuery = 'UPDATE inventory SET amount = amount + $1 WHERE name = $2';
            const updateResult = await db.query(updateQuery, [amount, name]);

            if (updateResult.rowCount > 0) {
                res.json({ message: `Successfully added ${amount} units to ${name}` });
            } else {
                res.status(500).json({ message: "Something went wrong while updating the ingredient." });
            }
        } else {
            // Ingredient not found
            res.status(404).json({ message: `Ingredient not found: ${name}` });
        }
    }
);

router.post('/updateMenuPricing', async (req, res) => {
    const { id, price } = req.body;

    try {
        // Check if the menu item exists
        const query = 'SELECT id FROM menu_pricing WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length > 0) {
            // Menu item exists, update its price
            const updateQuery = 'UPDATE menu_pricing SET price = $1 WHERE id = $2';
            const updateResult = await db.query(updateQuery, [price, id]);

            if (updateResult.rowCount > 0) {
                res.json({ message: `Price updated successfully for item ID ${id}` });
            } else {
                res.status(500).json({ message: "Failed to update menu item price." });
            }
        } else {
            // Menu item not found
            res.status(404).json({ message: `Menu item not found for ID: ${id}` });
        }
    } catch (err) {
        console.error("Error updating menu pricing:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});


router.get('/getMenuItems', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, type FROM menu");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ message: "Error retrieving menu items." });
    }
});

router.get('/getMenuPrices', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, price FROM menu_pricing");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching menu prices:", error);
        res.status(500).json({ message: "Error retrieving menu prices." });
    }
});

router.get('/getItemInventory', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, amount FROM inventory");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching menu prices:", error);
        res.status(500).json({ message: "Error retrieving inventory." });
    }
});


router.get('/getWeeklySales/:year/:month/:day', async (req, res) => {
    const { year, month, day } = req.params;

    try {
        const firstDay = new Date(year, month - 1, day, 9, 0, 0);

        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(21, 0, 0);

        const firstDayStr = firstDay.toISOString();
        const lastDayStr = lastDay.toISOString();

        console.log(`Date range: ${firstDayStr} to ${lastDayStr}`);

        const query = `
            SELECT customerid, orderid, timeofpurchase, totalcost 
            FROM customer_purchase_log 
            WHERE timeofpurchase::DATE BETWEEN $1::DATE AND $2::DATE
        `;
        const result = await db.query(query, [firstDayStr, lastDayStr]);

        const purchases = result.rows.map(row => ({
            customerId: row.customerid,
            orderId: row.orderid,
            time: row.timeofpurchase,
            totalCost: row.totalcost
        }));

        res.json(purchases);
    } catch (error) {
        console.error("Error retrieving weekly sales data:", error);
        res.status(500).json({ message: "An error occurred while fetching sales data." });
    }
});

router.get('/getHourlySales/:year/:month/:day', async (req, res) => {
    const { year, month, day } = req.params;

    let hourlySales = []; 
    try { 
        for (let hour = 9; hour < 21; hour++) { 
            const startTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00:00`; 
            const endTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour + 1).padStart(2, '0')}:00:00`; 
            
            const query = ` SELECT SUM(totalcost) AS total_sales_hour, 
            SUM(CASE WHEN paymentmethod = 'Card' THEN totalcost ELSE 0 END) 
            AS total_card, SUM(CASE WHEN paymentmethod = 'Cash' THEN totalcost ELSE 0 END) 
            AS total_cash FROM customer_purchase_log WHERE timeofpurchase >= $1 AND timeofpurchase < $2 `; 
            
            const result = await db.query(query, [startTime, endTime]); 
            if (result.rows.length > 0) { const row = result.rows[0]; 
                hourlySales.push({ hour: String(hour).padStart(2, '0'), 
                                    totalSales: row.total_sales_hour || 0, 
                                    totalSalesFormatted: (row.total_sales_hour || 0).toFixed(2), 
                                    totalCard: row.total_card || 0, totalCash: row.total_cash || 0, }); 
                                } 
                            } res.json(hourlySales); 
                        } 
    catch (error) { 
        console.error("Error retrieving hourly sales data:", error); 
        res.status(500).json({ message: "An error occurred while fetching sales data." }); 
    } 
});

module.exports = router;



