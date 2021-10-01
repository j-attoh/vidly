const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		minlength: 5,
		maxlength: 255,
		required: true,
	},
	genre: {
		type: new mongoose.Schema({
			name: { type: String, required: true },
		}),
		required: true,
	},
	numberInStock: {
		type: Number,
		min: 0,
		max: 255,
		required: true,
	},
	dailyRentalRate: {
		type: Number,
		min: 0,
		max: 255,
		required: true,
	},
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
	const schema = Joi.object({
		title: Joi.string().min(5).max(255).required(),
		numberInStock: Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required(),
		genreID: Joi.objectId().required(),
	});
	return schema.validate(movie, { abortEarly: false });
}

module.exports = { Movie, validateMovie };
