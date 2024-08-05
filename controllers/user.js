const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
	res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
	try {
		let { username, email, password } = req.body;
		let newUser = new User({ username, email });
		//User.register
		//-->checks whether there exists other users with same name
		//-->store password after salting and hashing
		const registeredUser = await User.register(newUser, password);
		req.logIn(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Welcome to WanderLodge!");
			res.redirect("/listings");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/signup");
	}
};

module.exports.renderLoginForm = (req, res) => {
	res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
	req.flash("success", "Welcome back to WanderLodge!");
	const redirectUrl = res.locals.redirectUrl || "listings";
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "you are logged out!");
		res.redirect("/listings");
	});
};
