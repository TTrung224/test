require("dotenv").config();
require("./config/Database").connect();
const cors = require('cors')
const express = require("express");
const route = require('./routes/Index');
const cookies = require('cookie-parser')
const path = require('path')
const config = process.env;

const app = express();
app.use(express.json());
app.use(cookies(config.COOKIE_KEY));
app.use(cors({origin: 'http://localhost:3000', credentials: true}))

// For getting images from server
app.get("/image/:imgName", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, `./productImgs/${req.params.imgName}`))
    } catch (error) {
        console.log(error)
        res.sendFile(path.join(__dirname, `./productImgs/placeholder.png`))
    }
})

route(app);

module.exports = app;