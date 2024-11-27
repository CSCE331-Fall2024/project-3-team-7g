const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors')

const getItemsByType = require('./routes/getItemsByType')
const manager = require('./routes/Manager')
const purchasing = require('./routes/purchasing')
const user = require('./routes/user')
const language = require('./routes/language')
const app = express();
app.use(cors())
const port = 3000;

app.use('/getItemsByType', getItemsByType);
app.use('/Manager', manager)
app.use('/purchasing', purchasing)
app.use('/user', user)
app.use('/language', language)

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