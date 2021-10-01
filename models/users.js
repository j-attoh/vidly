const mongoose = require("mongoose");
const Joi = require("joi");
const jwt  = require('jsonwebtoken') ; 

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 100,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		maxlength: 1024,
		trim: true,
	},
	isAdmin : Boolean 
});

userSchema.methods.generateAuthToken = function(){
	return jwt.sign({ _id : this._id , isAdmin: this.isAdmin }, process.env.jwtPrivateKey)
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().email().min(5).max(255).required(),
		password: Joi.string().min(5).max(255).required(),
	});
	return schema.validate(user, { abortEarly: false });
}

module.exports = { User, validateUser };
