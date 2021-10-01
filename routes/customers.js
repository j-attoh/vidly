const express = require("express");
const Joi = require("joi");
const Customer = require("../models/customers");

const router = express.Router();

router.get("/:id", async (req, res) => {
	const customer = await Customer.findById(req.params.id);
	if (!customer)
		return res
			.status(404)
			.send(`Customer with ID : ${req.params.id} not found `);
	res.json(customer);
});

router.get("/", async (req, res) => {
	const customers = await Customer.find().sort({ name: 1 });
	res.json(customers);
});

router.post("/", async (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
		phone: Joi.string().min(5).max(50).required(),
		isGold: Joi.boolean(),
	});
	const {
		value: { name, phone, isGold },
		error,
	} = schema.validate(req.body);

	if (error) {
		return res
			.status(400)
			.send({ error: error.details[0].message });
	}
	let customer = new Customer({ name, phone, isGold });
	customer = await customer.save(customer);
	res.json(customer);
});

router.put("/:id", async (req, res) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
		phone: Joi.string().min(5).max(50).required(),
		isGold: Joi.boolean(),
	});
	const {
		value: { name, phone, isGold },
		error,
	} = schema.validate(req.body);
	if (error) {
		return res
			.status(400)
			.send({ error: error.details[0].message });
	}
	const customer = await Customer.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name,
				phone,
				isGold,
			},
		},
		{ new: true }
	);
	res.json(customer);
});

router.delete("/:id", async (req, res) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);
	if (!customer)
		return res
			.status(404)
			.send(`customer with ID : ${req.params.id} Unknown `);
	res.json(customer);
});

module.exports = router;
