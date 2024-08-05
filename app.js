const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
	.then(() => {
		console.log("DB is connected..");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
	mongoUrl: dbUrl,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 3600,
});

store.on("error", () => {
	console.log("error in MONGO SESSION Store", err);
});

const sessionOptions = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		//cookie should be expire in 7 days(specified in msec)
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});



app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.get("/", (req, res) => {
	res.send("Hi, this is Home route!");
});

// app.get("/", async (req, res) => {
//   let list1 = new Listing({
//     title: "My new Villa",
//     description: "by the beach",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });
//   await list1.save();
//   console.log("data saved");
//   res.send("Hi i am root");
// });

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page Not Found!"));
});

//err middleware to handle errors
app.use((err, req, res, next) => {
	let { statusCode = 500, message = "something went wrong!" } = err;
	res.status(statusCode).render("./listings/error.ejs", { err });
});

app.listen(8080, () => {
	console.log("server is listening at port 8080..");
});
