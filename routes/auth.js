const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");

router.post("/", async (req, res) => {
	const { error } = authValidate(req.body);

	if (error) {
		const errorMessage = error.details.map((el) => el.message);
		return res.status(400).send({ error: errorMessage });
	}
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("invalid email or password");

	const validPassword = await bcrypt.compare(
		req.body.password,
		user.password
	);
	if (!validPassword)
		return res.status(400).send("invalid email or password");

	const token = user.generateAuthToken();
	res.send(token);
});

function authValidate(req) {
	const schema = Joi.object({
		email: Joi.string().email().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
	});
	return schema.validate(req, { abortEarly: false });
}

module.exports  = router ; 
