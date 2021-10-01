const express = require("express");
const errorHandler = require("../middleware/error");
const genreRouter = require("../routes/genres");
const customerRouter = require("../routes/customers");
const moviesRouter = require("../routes/movies");
const rentalsRouter = require("../routes/rentals");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const returnsRouter = require("../routes/returns");

module.exports = function (app) {
	app.use(express.json());

	app.use("/api/genres", genreRouter);
	app.use("/api/customers", customerRouter);
	app.use("/api/movies", moviesRouter);
	app.use("/api/rentals", rentalsRouter);
	app.use("/api/users", usersRouter);
	app.use("/api/returns", returnsRouter);
	app.use("/api/auth", authRouter);
	app.use(errorHandler);
};
