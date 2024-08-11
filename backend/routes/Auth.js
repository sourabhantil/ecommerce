const express = require("express");
const passport = require("passport");
const { createUser,loginUser, checkAuth, resetPasswordRequest, resetPassword, logout } = require("../controller/Auth");
const router = express.Router();

// auth is already added in base path
router
.post("/signup",createUser)
.post("/login",passport.authenticate('local'),loginUser)
.get("/check",passport.authenticate('jwt'),checkAuth) //TODO: refresh token time on check
.post("/reset-password-request",resetPasswordRequest)
.post("/reset-password",resetPassword)
.get("/logout",logout)

exports.router = router;