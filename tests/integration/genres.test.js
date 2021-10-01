const app = require("../../index");
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/users");

const Genre = require("../../models/genres");

describe("/api/genres", () => {
	afterEach(async () => {
		await Genre.deleteMany({});
	});
	afterAll(async () => {
		await mongoose.connection.close();
	});
	describe("GET /", () => {
		it("should return all genres", async () => {
			await Genre.collection.insertMany([
				{ name: "Romance" },
				{ name: "Action" },
				{ name: "Adventure" },
			]);
			const response = await request(app).get("/api/genres");
			console.log(response.body);
			expect(response.status).toBe(200);
			expect(response.statusCode).toBe(200);
			const genres = ["Romance", "Action", "Adventure"];
			genres.forEach((g) =>
				expect(
					response.body.some((el) => el.name == g)
				).toBeTruthy()
			);
		});
	});

	describe("GET /:id", () => {
		it("should return a genre when a valid id is provided", async () => {
			const genre = new Genre({ name: "Adventure" });
			await genre.save();

			const response = await request(app).get(
				`/api/genres/${genre._id}`
			);
			expect(response.statusCode).toBe(200);
			expect(response.body).toMatchObject({
				name: genre.name,
				_id: genre._id,
			});
		});

		it("should return 404 when an invalid id is provided", async () => {
			const response = await request(app).get(
				"/api/genres/1"
			);

			expect(response.status).toBe(404);
		});
	});

	describe("POST /", () => {
		let user;
		let token;
		beforeEach(async () => {
			user = new User({
				name: "Jonathan Attram",
				email: "prokwekz@gmail.com",
				password: "#gt68682",
				isAdmin: true,
			});
			await user.save() 
			token = user.generateAuthToken();
		});
		afterEach(async () => {
			await User.deleteMany({});
			await Genre.deleteMany({}); 
		});

		it("should return a 401 if user is not logged in ", async () => {
			const response = await request(app)
				.post("/api/genres")
				.send({ name: "Adventure" });
			expect(response.status).toBe(401);
		});
		it("should return 400 if user body is not provided", async () => {
			const response = await request(app)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({});
			expect(response.status).toBe(400);
		});
		it("should retun 400 if genre less than 5 characters", async () => {
			const response = await request(app)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "joe" });
			expect(response.status).toBe(400);
		});

		it("should return 400 if genre more than 50 characters", async () => {
			const response = await request(app)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "a".repeat(51) });

			expect(response.status).toBe(400)
		});
		it("should save the genre if it is valid", async () => {
			await request(app)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "Romance" });

			const genre = await Genre.find({ name: "Romance" });

			expect(genre).not.toBeNull();
		});
		it("should return  the genre if it is valid", async () => {
			const response = await request(app)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "Romance" });

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				name: "Romance",
			});
			expect(response.body).toHaveProperty("_id");
			expect(response.body._id).not.toBeNull();
		});
	});
});
