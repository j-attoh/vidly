const express = require("express");
const router = express.Router();

const { Movie, validateMovie } = require("../models/movies");
const Genre = require("../models/genres");

router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie)
		res.status(404).send(
			`movie with ID : ${req.params.id} not found`
		);
	res.json(movie);
});

router.get("/", async (req, res) => {
	const movies = await Movie.find().sort({ title: 1 });
	res.json(movies);
});

router.post("/", async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) {
		const errorMessage  = error.details.map(el => el.message) 
		return res.status(400).send(errorMessage);
	}
	const genre = await Genre.findById(req.body.genreID);
	if (!genre)
		return res
			.status(400)
			.send(`Invalid Genre with ID : ${req.body.genreID}`);

	let movie = new Movie({
		title: req.body.title,
		genre: { _id: genre._id, name: genre.name },
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});
	movie = await movie.save();
	res.json(movie);
});

router.put("/:id", async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	const genre = await Genre.findById(req.body.genreID);
	if (!genre)
		return res
			.status(400)
			.send(`invalid Genre with ID : ${req.body.genreID}`);
	const movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				title: req.body.title,
				genre: { _id: genre._id, name: genre.name },
				numberInStock: req.body.numberInStock,
				dailyRentalRate: req.body.dailyRentalRate,
			},
		},
		{ new: true }
	);
	if (!movie)
		return res
			.status(404)
			.send(
				`movie with given Id : ${req.params.id} was not found `
			);

	res.json(movie);
});

router.delete("/:id", async (req, res) => {
	const movie = await Movie.findByIdAndDelete(req.params.id);
	if (!movie)
		return res
			.status(404)
			.send(`movie with ID : ${req.params.id} Unknown`);

	res.json(movie);
});

module.exports = router;
