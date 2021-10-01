const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	const token = req.header("x-auth-token");
	// sometimes token = req.headers.authorization -> Bearer token
	if (!token)
		return res
			.status(401)
			.send("Access denied . No token provided");

	try {
		const decodedPayload = jwt.verify(
			token,
			process.env.jwtPrivateKey
		);
		req.user = decodedPayload;
		next();
	} catch (err) {
		res.status(400).send("invalid token");
	}
}

module.exports  = auth ; 
