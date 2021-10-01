function admin(req, res, next) {
	if (!req.user.isAdmin)
		return res
			.status(403)
			.send("Access denied , You are forbidden ! ");
	next();
}

module.exports = admin;
