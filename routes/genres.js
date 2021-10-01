const express = require("express");
const Joi = require("joi");
const Genre = require("../models/genres");
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId')
const auth  = require('../middleware/auth')

router.get("/:id",validateObjectId,  async (req, res) => {
	const result = await Genre.findById(req.params.id);
	if (!result)
		return res
			.status(404)
			.send(`genre with ID : ${req.params.id} not found `);
	res.json(result);
});
router.get("/", async (req, res, next) => {
	try {
		const result = await Genre.find().sort({ name: 1 });
		res.status(200).json(result);
	} catch (err) {
		//res.status(500).send('Internal Server Error: Something Failed!')
		next(err);
	}
});
router.post("/", auth, async (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
	});
	const {
		error, value: { name }
	} = schema.validate(req.body);

	if (error) {
		return res
			.status(400)
			.send({ error: error.details[0].message });
	}
	let  genre = new Genre({
		name: name 
	});
	genre = await genre.save();
	res.json(genre);
});

router.put("/:id", async (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(5).required(),
	});
	const {
		error,
		value: { name },
	} = schema.validate(req.body);
	if (error) {
		return res.send({ error: error.details[0].message });
	}
	const genre = await Genre.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name,
			},
		},
		{ new: true }
	);

	if (!genre)
		return res
			.status(404)
			.send(`course with ID : ${req.params.id} not found `);

	res.json(genre);
});

router.delete("/:id", async (req, res) => {
	const result = await Genre.findByIdAndDelete(req.params.id);

	if (!result)
		return res
			.status(404)
			.send(`course with ID : ${req.params.id} unknown `);

	res.send(result);
});

module.exports = router;
