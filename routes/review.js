const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Reviews
//Post Review Route
router.post(
	"/",
	isLoggedIn,
	validateReview,
	wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
	"/:reviewId",
	isAuthor,
	wrapAsync(reviewController.destroyReview)
);

module.exports = router;
