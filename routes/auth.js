const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
	"/login",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email"),
		check("password", "Password must be at least 5 alphanumeric characters")
			.isLength({ min: 5 })
			.isAlphanumeric()
	],
	authController.postLogin
);

router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(UserDoc => {
					if (UserDoc) {
						return Promise.reject("Email already exists");
					}
				});
			}),
		body("password", "Password must be at least 5 alphanumeric characters")
			.isLength({ min: 5 })
			.isAlphanumeric(),
		body("confirmPassword").custom((value, { req }) => {
			if (req.body.password !== value) {
				throw new Error("Passwords have to match");
			}
			return true;
		})
	],
	authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getRest);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
