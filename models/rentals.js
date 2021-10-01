const mongoose = require("mongoose");
const moment  = require("moment")
const Joi = require("joi");
Joi.objectId  = require('joi-objectid')(Joi) 

const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50,
			},
			phone: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50,
			},
			isGold: {
				type: Boolean,
				default: false,
			},
		}),
		required: true,
	},
	movie: {
		type: new mongoose.Schema({
			title: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 255,
			},
			dailyRentalRate: {
				type: Number,
				required: true,
				min: 0,
				max: 255,
			},
		}),
		required: true,
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now,
	},
	dateReturned: Date,
	rentalFee: {
		type: Number,
		min: 0,
	},
});

rentalSchema.methods.setReturnProps = function() {
	this.dateReturned = new Date() 

	const rentalDays  = moment().diff(this.dateOut, 'days') 
	this.rentalFee = rentalDays * this.movie.dailyRentalRate 

}

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
	const schema = Joi.object({
		customerID: Joi.objectId().required(),
		movieID: Joi.objectId().required(),
	});
	return schema.validate(rental, { abortEarly: false })
}

module.exports  = { Rental, validateRental }
