require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const app = express();
const PORT = 3000;

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(express.json());

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));

app.use("/users", routes);
