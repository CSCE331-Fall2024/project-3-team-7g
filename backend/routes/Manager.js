const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();

router.use(express.json());

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

router.post('/addInventoryItem', async (req, res) => {
    const { ingredientName, amount } = req.body;

    const idResult = await pool.query("SELECT MAX(id) AS highest_id FROM menu");
    const highestId = idResult.rows[0].highest_id || 0;
    const id = highestId + 1;

    const insertQuery = "INSERT INTO inventory (id, name, amount) VALUES ($1, $2, $3)";
    const updateResult = await pool.query(insertQuery, [id, ingredientName, amount]);


    if (updateResult.rowCount > 0) {
        res.json({ message: `Successfully added ${ingredientName} with an amount of ${amount}` });
    } else {
        res.status(500).json({ message: "Something went wrong while adding the item" });
    }
}
);

router.post('/addMenuItem', async (req, res) => {
    const { itemName, itemType } = req.body;

    const idResult = await pool.query("SELECT MAX(id) AS highest_id FROM menu");
    const highestId = idResult.rows[0].highest_id || 0;
    const id = highestId + 1;

    const insertQuery = "INSERT INTO menu (id, name, type) VALUES ($1, $2, $3)";
    const updateResult = await pool.query(insertQuery, [id, itemName, itemType]);


    if (updateResult.rowCount > 0) {
        res.json({ message: `Successfully added ${itemName} as ${itemType}` });
    } else {
        res.status(500).json({ message: "Something went wrong while adding the item" });
    }
}
);

router.post('/addQuantity', async (req, res) => {
    const { ingredientName, amountToAdd } = req.body;

    const query = 'SELECT amount FROM inventory WHERE name = $1';
    const result = await pool.query(query, [ingredientName]);

        if (result.rows.length > 0) {
            // Ingredient exists, so update
            const updateQuery = 'UPDATE inventory SET amount = amount + $1 WHERE name = $2';
            const updateResult = await pool.query(updateQuery, [amountToAdd, ingredientName]);

            if (updateResult.rowCount > 0) {
                res.json({ message: `Successfully added ${amountToAdd} units to ${ingredientName}` });
            } else {
                res.status(500).json({ message: "Something went wrong while updating the ingredient." });
            }
        } else {
            // Ingredient not found
            res.status(404).json({ message: `Ingredient not found: ${ingredientName}` });
        }
    }
);

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
        const result = await pool.query(query, [firstDayStr, lastDayStr]);

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

    try {
        const firstDay = new Date(year, month - 1, day, 9, 0, 0);

        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(21, 0, 0);

        const firstDayStr = firstDay.toISOString();
        const lastDayStr = lastDay.toISOString();

        console.log(`Date range: ${firstDayStr} to ${lastDayStr}`);

        const query = `
            SELECT SUM(totalcost) AS total_sales_hour, SUM(CASE WHEN paymentmethod = 'Card' THEN totalcost ELSE 0 END) 
            AS total_card, SUM(CASE WHEN paymentmethod = 'Cash' THEN totalcost ELSE 0 END) 
            AS total_cash FROM customer_purchase_log WHERE timeofpurchase >= 
            $1::DATE AND timeofpurchase < $2::DATE
        `;
        const result = await pool.query(query, [firstDayStr, lastDayStr]);

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

module.exports = router;



