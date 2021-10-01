const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

describe("user.generateAuthToken", () => {
	it("should return a valid jwt token", async () => {
		const user = new User({
			name: "Jonathan Attram",
			email: "prokwekz@gmail.com",
			password: "#gt68682",
			isAdmin: true,
		});

		const token = user.generateAuthToken();

		const decodedPayload = jwt.verify(
			token,
			process.env.jwtPrivateKey
		);
		console.log(decodedPayload);

		expect(decodedPayload).toMatchObject({ isAdmin: true });
		expect(decodedPayload).toHaveProperty("_id");
		expect(decodedPayload._id).toBeDefined();
		expect(decodedPayload._id).not.toBeNull();

		expect(
			mongoose.Types.ObjectId.isValid(decodedPayload._id)
		).toBe(true);
	});
});
