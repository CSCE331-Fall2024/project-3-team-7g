const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors')
const getItemsByType = require('./routes/getItemsByType')

const addQuantity = require('./routes/Manager')
const addMenuItem = require('./routes/Manager')
const addInventoryItem = require('./routes/Manager')
const getWeeklySales = require('./routes/Manager')
const getHourlySales = require('./routes/Manager')
const completePurchase = require('./routes/purchasing')
const getMenuItems = require('./routes/Manager')
const updateMenuPricing = require('./routes/Manager')
const getMenuPrices = require('./routes/Manager')
const getItemInventory = require('./routes/Manager')
const getUsageData = require('./routes/Manager')
const getUsers = require('./routes/Manager')
const changeClassification = require('./routes/Manager')

const manager = require('./routes/manager')
const purchasing = require('./routes/purchasing')
const user = require('./routes/user')
const app = express();
app.use(cors())
const port = 3000;

app.use('/getItemsByType', getItemsByType)
app.use('/Manager', addQuantity)
app.use('/Manager', addMenuItem)
app.use('/Manager', addInventoryItem)
app.use('/Manager', getWeeklySales)
app.use('/Manager', getHourlySales)
app.use('/Manager', getMenuItems)
app.use('/Manager', updateMenuPricing)
app.use('/purchasing', completePurchase)
app.use('/Manager', getMenuPrices)
app.use('/Manager', getItemInventory)
app.use('/Manager', getUsageData)
app.use('/Manager', getUsers)
app.use('/Manager', changeClassification)

app.use('/Manager', manager)
app.use('/purchasing', purchasing)
app.use('/user', user)

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.get('/', (req, res) => {
    console.log('You have successfully called the backend of team 7g')
    res.send({name: "Diego"})
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});