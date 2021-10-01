const winston = require('winston') 

const errorHandler = (err, req, res, next) => {
	winston.error(err.message, err) 
	res.status(500).send("Internal Server errror; Something Failed!");
};

module.exports = errorHandler;
