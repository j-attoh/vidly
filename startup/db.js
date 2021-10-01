const mongoose  = require('mongoose') 
const logger  = require('./logging') 

const db = process.env.DB_TEST || "mongodb://localhost/vidly" 

module.exports  = function (){
	mongoose.connect(db) 
	.then(() => logger.info(`connected to MongoDB: ${db}`)) 

}
