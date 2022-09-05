const { verifySignUp } = require("../middlewares");
const authJwt = require("../middlewares/authJwt");
const authController = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signup
);
router.post("/signin", authController.signin);
router.post("/signout", authJwt.verifyToken, authController.signout);

// router.delete("/logout", (req, res) => {
//   const refreshToken = req.header("x-auth-token");

//   let refreshTokens = [];
//   refreshTokens.push(authController.generateRefreshToken(req.body));

//   refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//   res.sendStatus(204);
// });

module.exports = router;
