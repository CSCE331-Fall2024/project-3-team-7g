const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const router = express.Router();
const db = require("../db")

router.use(express.json());


/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/addInventoryItem
@function
@param {express.Request} req - The HTTP request object, containing `name` and `amount` in the body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Adds a new unique inventory item to the inventory table with a specified amount.
*/
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

/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/addMenuItem
@function
@param {express.Request} req - The HTTP request object, containing itemName and itemType in the body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Adds a new menu item with an associated type to the menu table with the latest menu ID.
*/
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

/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/addQuantity
@function
@param {express.Request} req - The HTTP request object, containing name and amount in the body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Adds the amount to a specified inventory item to the inventory table.
*/
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

/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/updateMenuPricing
@function
@param {express.Request} req - The HTTP request object, containing id and price in the body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Changes the price of a specified menu item to a new price.
*/
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

/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/changeClassification
@function
@param {express.Request} req - The HTTP request object, containing user_id and classification in the body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Changes the classification of a specified user.
*/
router.post('/changeClassification', async (req, res) => {
    const { user_id, classification } = req.body;

    // Validation
    if (!user_id || !classification) {
        return res.status(400).json({ message: "user_id and classification are required." });
    }

    try {
        // Directly update and check result
        const updateQuery = 'UPDATE users SET classification = $1 WHERE user_id = $2';
        const updateResult = await db.query(updateQuery, [classification, user_id]);

        if (updateResult.rowCount > 0) {
            res.json({ message: `Classification updated successfully for user_ID ${user_id}` });
        } else {
            res.status(404).json({ message: `User with user_ID ${user_id} not found.` });
        }
    } catch (err) {
        console.error("Error updating classification:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});


/**
Handles HTTP GET requests to the "/link" endpoint.*
@name get/getMenuItems
@function 
@param {express.Request} req - The HTTP request object.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Returns all of the menu items along with their associated IDs and types from the menu table.
*/
router.get('/getMenuItems', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, type FROM menu");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ message: "Error retrieving menu items." });
    }
});

/**
Handles HTTP GET requests to the "/link" endpoint.*
@name get/getMenuPrices
@function
@param {express.Request} req - The HTTP request object.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Returns all of the menu prices along with their associated IDs and menu names from the menu_pricing table.
*/
router.get('/getMenuPrices', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, price FROM menu_pricing");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching menu prices:", error);
        res.status(500).json({ message: "Error retrieving menu prices." });
    }
});

/**
Handles HTTP GET requests to the "/link" endpoint.*
@name get/getItemInventory
@function
@param {express.Request} req - The HTTP request object.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Returns all of the inventory items along with their associated IDs and amounts from the inventory table.
*/
router.get('/getItemInventory', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, amount FROM inventory");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching menu prices:", error);
        res.status(500).json({ message: "Error retrieving inventory." });
    }
});

/**
Handles HTTP GET requests to the "/link" endpoint.*
@name get/getUsers
@function
@param {express.Request} req - The HTTP request object.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Returns all of the users along with their associated user IDs, emails, and classifications from the users table.
*/
router.get('/getUsers', async (req, res) => {
    try {
        const result = await db.query("SELECT user_id, name, email, classification FROM users"); // Add the table name here
        res.json(result.rows); // Return rows to the client
    } catch (error) {
        console.error("Error fetching users", error);
        res.status(500).json({ message: "Error retrieving users." });
    }
});

/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/getUsageData
@function
@param {express.Request} req - The HTTP request object, containing the startYear, startMonth, startDay, startHour, endYear, endMonth, endDay, and endHour.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Returns amount of inventory items used given a specified time period.
*/
router.post('/getUsageData', async (req, res) => {
    try {
        const { startYear, startMonth, startDay, startHour, endYear, endMonth, endDay, endHour } = req.body;

        if (!startYear || !startMonth || !startDay || !startHour || !endYear || !endMonth || !endDay || !endHour) {
            return res.status(400).json({ message: "All date and time fields are required." });
        }

        const startYearInt = parseInt(startYear);
        const startMonthInt = parseInt(startMonth);
        const startDayInt = parseInt(startDay);
        const startHourInt = parseInt(startHour);
        const endYearInt = parseInt(endYear);
        const endMonthInt = parseInt(endMonth);
        const endDayInt = parseInt(endDay);
        const endHourInt = parseInt(endHour);

        if (
            startMonthInt < 1 || startMonthInt > 12 || endMonthInt < 1 || endMonthInt > 12 ||
            startDayInt < 1 || startDayInt > 31 || endDayInt < 1 || endDayInt > 31 ||
            startHourInt < 0 || startHourInt > 23 || endHourInt < 0 || endHourInt > 23
        ) {
            return res.status(400).json({ message: "Invalid date or time values." });
        }

        const startTimestamp = `${startYearInt}-${startMonthInt.toString().padStart(2, '0')}-${startDayInt.toString().padStart(2, '0')} ${startHourInt.toString().padStart(2, '0')}:00:00`;
        const endTimestamp = `${endYearInt}-${endMonthInt.toString().padStart(2, '0')}-${endDayInt.toString().padStart(2, '0')} ${endHourInt.toString().padStart(2, '0')}:00:00`;

        const query = `
            SELECT i.id, i.name, SUM(ms.quantity_bought) AS total_usage
            FROM menu_sales ms
            JOIN menu_to_ingredients mi ON ms.menu_id = mi.menu_id
            JOIN inventory i ON mi.ingredient_id = i.id
            WHERE ms.purchase_date BETWEEN $1 AND $2
            GROUP BY i.id, i.name
        `;

        const result = await db.query(query, [startTimestamp, endTimestamp]);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching usage data:", error);
        res.status(500).json({ message: "Error retrieving usage data." });
    }
});

/**
Handles HTTP POST requests to the "/link" endpoint.*
@name post/getWeeklySales
@function
@param {express.Request} req - The HTTP request object, containing year, month, and day in the body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Fetches sales data for a specified week starting from the given date.
*/
router.post('/getWeeklySales', async (req, res) => {
    try {
        const { year, month, day } = req.body;

        if (!year || !month || !day) {
            return res.status(400).json({ message: "Year, month, and day are required." });
        }

        // Parse input values
        const startYear = parseInt(year);
        const startMonth = parseInt(month) - 1; // Adjust for 0-based month indexing
        const startDay = parseInt(day);

        if (
            isNaN(startYear) || isNaN(startMonth) || isNaN(startDay) ||
            startMonth < 0 || startMonth > 11 || startDay < 1 || startDay > 31
        ) {
            return res.status(400).json({ message: "Invalid date values provided." });
        }

        // Calculate the starting and ending timestamps
        const startDate = new Date(startYear, startMonth, startDay, 9, 0, 0); // Start at 9 AM
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // Add 6 days for the week
        endDate.setHours(21); // End at 9 PM

        const startTimestamp = startDate.toISOString();
        const endTimestamp = endDate.toISOString();

        // Debugging range (optional, can be removed in production)
        console.log(`Start: ${startTimestamp}, End: ${endTimestamp}`);

        // Query the database for customer purchases within the date range
        const query = `
            SELECT customerid, orderid, timeofpurchase, totalcost
            FROM customer_purchase_log
            WHERE timeofpurchase BETWEEN $1 AND $2
        `;
        const result = await db.query(query, [startTimestamp, endTimestamp]);

        // Map result rows to a simplified structure
        const purchases = result.rows.map(row => ({
            customerId: row.customerid,
            orderId: row.orderid,
            time: row.timeofpurchase,
            totalCost: row.totalcost
        }));

        res.json(purchases);
    } catch (error) {
        console.error("Error fetching weekly sales data:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

/**
Handles HTTP GET requests to the "/link" endpoint.*
@name get/getHourlySales
@function
@param {express.Request} req - The HTTP request object, containing year, month, and day in the request body.
@param {express.Response} res - The HTTP response object.
@param {Function} next - The next middleware function in the stack.
@description Fetches hourly sales data for a specified date.
*/
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



