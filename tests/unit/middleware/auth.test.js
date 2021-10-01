const { User } = require("../../../models/users");
const auth = require('../../../middleware/auth')
require('dotenv').config() 

describe("auth middleware", () => {
	it("should populate req.user with payload of  a valid jwt", () => {
		const user  = new User({ isAdmin: true });
		const token = user.generateAuthToken() 
		const req = { header: jest.fn().mockReturnValue(token) };
		const res = {};
		const next = jest.fn();

		auth(req, res, next) 

		expect(req.user).toMatchObject({ _id : user._id, isAdmin: user.isAdmin  })


	});
});
