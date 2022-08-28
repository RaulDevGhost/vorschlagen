require("dotenv").config();
const express = require("express");
const Model = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// accessTokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
// refreshTokens
let refreshTokens = [];
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20m",
  });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

//Post Method
router.post("/register", async (req, res) => {
  try {
    const user = await Model.findOne({
      username: new RegExp("^" + req.body.username + "$", "i"),
    });
    if (user) {
      res.status(404).send("username already exist!");
    }
    const data = new Model({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    });
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  await Model.find().then((users) => {
    users.forEach((user) => {
      if (user.username === req.body.username) {
        if (bcrypt.compare(req.body.password, user.password)) {
          const accessToken = generateAccessToken({ user: req.body.username });
          const refreshToken = generateRefreshToken({
            user: req.body.username,
          });
          res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
          res.status(401).send("Password Incorrect!");
        }
      } else {
        res.status(404).send("User does not exist!");
      }
    });
  });
});

//Get all Method
router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
