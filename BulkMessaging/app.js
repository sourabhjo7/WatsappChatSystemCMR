require("dotenv").config();//for using environment variables
require("./config/database").connect();//Setting up the database connection

const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require("cors");//for enabling api requuest from external source


const PORT = process.env.PORT;

const app = express();

// Routers
const indexRouter = require("./route/route");


//middleware using cors with options
app.use(cors({
    origin: ['http://localhost:3000', "http://localhost:5000"],
    optionsSuccessStatus: 200,
    credentials: true
  }
));

//Defining headers for cors
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
});

//middleware using bodyParser
app.use(bodyParser.json());


app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
