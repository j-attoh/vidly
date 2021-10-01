const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/users");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select({ password: -1 });
	res.json(user);
});

router.post("/", async (req, res) => {
	const { error } = validateUser(req.body);

	if (error) {
		const errorMessage = error.details.map((el) => el.message);
		res.status(400).send({ error: errorMessage });
	}

	const emailExists = await User.findOne({ email: req.body.email });
	if (emailExists)
		return res
			.status(400)
			.send(
				`User with email : ${req.body.email} already exists `
			);

	const user = new User({
		...req.body,
	});
	const hashSalt = await bcrypt.genSalt();
	user.password = await bcrypt.hash(user.password, hashSalt);

	await user.save();
	let safeUser = { _id: user._id, name: user.name, email: user.email };
	const token = user.generateAuthToken();
	res.header("x-auth-token", token).json(safeUser);
});

module.exports = router;
