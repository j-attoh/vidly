const request = require("supertest");
const app = require("../../index");
const mongoose = require("mongoose");
const moment = require("moment");
const Customer = require("../../models/customers");
const { Movie } = require("../../models/movies");
const { Rental } = require("../../models/rentals");
const { User } = require("../../models/users");
const Genre = require("../../models/genres");

describe("/api/returns", () => {
	let customer;
	let rental;
	let movie;
	beforeEach(async () => {
		customer = new Customer({
			name: "Jonathan",
			phone: "024484358",
		});
		movie = new Movie({
			title: "Crime to Christ",
			dailyRentalRate: 19,
			numberInStock: 100,
			genre: new Genre({ name: "Romance " }),
		});
		rental = new Rental({
			customer,
			movie: {
				_id: movie._id,
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate,
			},
		});
		await rental.save();
		await movie.save();
	});
	afterEach(async () => {
		await Rental.deleteMany({});
		await Movie.deleteMany({});
	});
	afterAll(async () => {
		await mongoose.connection.close();
	});

	it("should work", async () => {
		const result = await Rental.findById(rental._id);
		expect(result).not.toBeNull();
	});
	it("should return a 401 if client is not logged in", async () => {
		const response = await request(app)
			.post("/api/returns")
			.send({ customerID: customer._id, movieID: movie._id });
		expect(response.status).toBe(401);
	});
	it("should return 400 if customerID is not provided", async () => {
		const token = new User().generateAuthToken();
		const response = await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ movieID: movie._id });
		expect(response.status).toBe(400);
		expect(response.text).toMatch(/customerID/);
	});
	it("should return 400 if movieID is not provided", async () => {
		const token = new User().generateAuthToken();
		const response = await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id });
		expect(response.status).toBe(400);
		expect(response.text).toMatch(/movieID/);
	});

	it("should return 404 if rental not found for movieID or customerID", async () => {
		const token = new User().generateAuthToken();
		await Rental.deleteMany({});
		const response = await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });
		expect(response.status).toBe(404);
		expect(response.text).toMatch(/.*not.*found/);
	});
	it("should return 400 if rental already processed", async () => {
		rental.dateReturned = new Date().toLocaleDateString();
		await rental.save();
		const token = new User().generateAuthToken();
		const response = await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });

		expect(response.status).toBe(400);
	});

	it("should return 200 if rental returns is valid", async () => {
		const token = new User().generateAuthToken();
		const response = await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });
		expect(response.status).toBe(200);
	});
	it("should set returnDate if input is valid ", async () => {
		const token = new User().generateAuthToken();
		await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });

		const newRental = await Rental.findById(rental._id);
		expect(newRental.dateReturned).toBeDefined();
		expect(newRental.dateReturned).toBeInstanceOf(Date);
		expect(new Date() - newRental.dateReturned).toBeLessThan(
			10 * 1000
		);
	});

	it("should set rentalFee is input is valid", async () => {
		const token = new User().generateAuthToken();
		rental.dateOut = moment().add(-5, "days").toDate();
		await rental.save();
		await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });

		const newRental = await Rental.findById(rental._id);
		expect(newRental.rentalFee).toBeDefined();
		expect(newRental.rentalFee).toBe(95);
	});

	it("should increase the movie stock if input is valid", async () => {
		const token = new User().generateAuthToken();
		await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });

		const newMovie = await Movie.findById(rental.movie._id);
		expect(newMovie.numberInStock).toBeGreaterThan(
			movie.numberInStock
		);
		expect(newMovie.numberInStock).toBe(movie.numberInStock + 1);
	});
	it("should return rental object if input is valid", async () => {
		const token = new User().generateAuthToken();
		const response = await request(app)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerID: customer._id, movieID: movie._id });

		expect(response.body).toMatchObject({
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
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining([
				"customer",
				"movie",
				"dateOut",
				"dateReturned",
				"rentalFee",
				"_id"
			])
		);
	});
});
