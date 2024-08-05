const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
	await mongoose.connect(MONGO_URL);
}

main()
	.then(() => {
		console.log("DB is connected..");
	})
	.catch((err) => {
		console.log(err);
	});

const initDB = async () => {
	await Listing.deleteMany({});
	// console.log(initData.data);
	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "66abbc85e6f6d32b779e8f92",
	}));
	await Listing.insertMany(initData.data);

	console.log("database initialised..");
};

initDB();
