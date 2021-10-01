const express = require("express");
const router = express.Router();
const moment = require("moment");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const auth = require("../middleware/auth");
const { Rental } = require("../models/rentals");
const { Movie } = require("../models/movies");

function validateReturns(returns) {
	const schema = Joi.object({
		customerID: Joi.objectId().required(),
		movieID: Joi.objectId().required(),
	});
	return schema.validate(returns, { abortEarly: false });
}

router.post("/", auth, async (req, res) => {
	const { error } = validateReturns(req.body);
	if (error)
		return res
			.status(400)
			.send(error.details.map((el) => el.message));
	const rental = await Rental.findOne({
		"customer._id": req.body.customerID,
		"movie._id": req.body.movieID,
	});
	if (!rental) res.status(404).send("rental not found ");

	if (rental.dateReturned)
		return res.status(400).send("rental already processed");

	rental.setReturnProps() 
	await rental.save();

	await Movie.findByIdAndUpdate(rental.movie._id, {
		$inc: { numberInStock: 1 },
	});
	return res.status(200).send(rental);
});

module.exports = router;
