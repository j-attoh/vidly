require("express-async-errors");
const express = require("express");
const app = express();

require("dotenv").config();
// check if jwtPrivateKey is set 

// const Joi = require('joi') 
// Joi.objectId  = require('joi-objectid')(Joi)

require("./startup/routes")(app);
require("./startup/db")() ;  
require("./startup/prod")(app) 

module.exports  = app ; 

