require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const Authroutes = require("./routes/test.routes");
const db = require("./models");
const Role = db.role;

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

const mongoString = process.env.DATABASE_URL;

mongoose
  .connect(mongoString)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
const database = mongoose.connection;

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// database.on("error", (error) => {
//   console.log(error);
// });

// database.once("connected", () => {
//   console.log("Database Connected");
// });

app.use(express.json());

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));

app.use("/users", routes);
app.use("/auth/users", Authroutes);
