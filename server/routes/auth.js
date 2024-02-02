const express = require("express");
const router = express.Router();
const passport = require("passport");

/* ROUTE CONFIGURATION FOR AUTH */
router.use('/', require('../controllers/auth/auth-controller'));

/* LOGIN SUCCESS ROUTE */
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully LoggedIn",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

/* LOGIN FAILURE ROUTE */
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
