const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const cors = require('cors')
const login = require('./routes/login')
const getItemsByType = require('./routes/getItemsByType')
const addQuantity = require('./routes/Manager')
const addMenuItem = require('./routes/Manager')
const addInventoryItem = require('./routes/Manager')
const getWeeklySales = require('./routes/Manager')

const app = express();
app.use(cors())
const port = 3000;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

app.use('/login', login)
app.use('/getItemsByType', getItemsByType)
app.use('/Manager', addQuantity)
app.use('/Manager', addMenuItem)
app.use('/Manager', addInventoryItem)
app.use('/Manager', getWeeklySales)

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