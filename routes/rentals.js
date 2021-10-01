const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentals");
const Customer = require("../models/customers");
const { Movie } = require("../models/movies");

router.get("/", async (req, res) => {
	const rental = await Rental.find().sort({ dateOut: -1 });
	res.json(rental);
});

router.get("/:id", async (req, res) => {
	const rental = await Rental.findById(req.params.id);
	if (!rental)
		res.status(404).send(
			`Could not find Rental with ID : ${req.params.id}`
		);

	res.json(rental);
});

router.post("/", async (req, res) => {
	const { error } = validateRental(req.body);
	if (error) {
		const errorMessage = error.details.map((el) => el.message);
		res.status(400).send(errorMessage);
		//res.status(400).send(error.details[0].message);
	}
	const customer = await Customer.findById(req.body.customerID);
	if (!customer)
		return res
			.status(400)
			.send(
				`invalid Customer with ID : ${req.body.customerID}`
			);

	let  movie = await Movie.findById(req.body.movieID);
	if (!movie)
		return res
			.status(400)
			.send(`invalid Movie with ID : ${req.body.movieID}`);

	let rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	});

	const session = await mongoose.startSession();
	await session.withTransaction(async () => {
		movie.numberInStock--;
		await movie.save();
		return rental.save();
	});
	session.endSession();
	res.json(rental);
});

module.exports = router;
