const { User } = require("../../models/users");
const app = require("../../index");
const request = require("supertest");
const mongoose = require("mongoose");
const Genre = require("../../models/genres");

describe("auth middleware", () => {
	let user;
	let token;

	beforeEach( () => {
		user = new User({
			name: "Jonathan Attram",
			email: "prokwekz@gmail.com",
			password: "#gt68682",
			isAdmin: true,
		});
		token = user.generateAuthToken();
	});

	afterEach(async () => {
		await Genre.deleteMany({});
	});
	afterAll(async () => {
		await mongoose.connection.close();
	});

	it("should return 401 if token is not provided", async () => {
		// no token provided 
		const response = await request(app)
			.post("/api/genres")
			.send({ name: "adventure" });

		expect(response.status).toBe(401);
	});

	it("should return 400 if invalid token is provided", async () => {
		// token provided invalid 
		const response = await request(app)
			.post("/api/genres")
			.set("x-auth-token", "invalid token")
			.send({ name: "romance" });
		expect(response.status).toBe(400);
	});

	it("should return 200 if token is valid", async () => {
		//valid token provided 
		const response = await request(app)
			.post("/api/genres")
			.set("x-auth-token", token)
			.send({ name: "horror" });
		expect(response.status).toBe(200);
	});
});
