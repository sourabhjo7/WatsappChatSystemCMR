const express = require("express");
const router = express.Router();//importing routers for the express package

//Requring Controllers
const controller = require('../controller/auth');

//importing custom middlewares
const {valToken, isAdmin, isAdminOrManager} = require("../middleware/auth");

//route for registering a new user to the system
router.post("/register", valToken, isAdminOrManager, controller.register);

//route for loging in a new user to the system
router.post("/login", controller.login);

//route for loging out a user from the system
router.get("/logout", controller.logout);

module.exports = router
