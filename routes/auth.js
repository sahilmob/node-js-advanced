const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email"),
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
