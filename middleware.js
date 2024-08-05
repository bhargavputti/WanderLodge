const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		//user is not logged in
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "Please Login to create a listing!");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};

module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "you are not the owner of this listing!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	let { reviewId, id } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author._id.equals(res.locals.currUser._id)) {
		req.flash("error", "you are not the author of this review!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};


//middelware for server side validation for listing
module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

//middelware for server side validation for review
module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};
