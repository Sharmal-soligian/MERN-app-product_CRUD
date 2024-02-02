const mongoose = require("mongoose");
const mongodb_url = process.env.MONGO;

mongoose.connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/* ENSURE CONNECTION */
mongoose.connection.on("connected", () => console.log("Connected to database"));
mongoose.connection.on("error", (err) =>
    console.log("Error connecting to database " + err)
);
