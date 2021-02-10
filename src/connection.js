require('dotenv').config();
const mongoose = require('mongoose');

let url
if(process.env.NODE_ENV === "development") {
	url = "mongodb://localhost:27017/haraichi"
} else {
	url = process.env.MONGO_URI
}
const serve = () => {
	mongoose
		.connect(
			url,
			{ useUnifiedTopology: true },
			{ useNewUrlParser: true },
			{ useFindAndModify: false }
		)
		.then((_) => console.log('DB CONNECTED'))
		.catch((err) => console.log(err));
}

module.exports = serve