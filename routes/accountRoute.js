// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")


// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// register route
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// process registration of Account
router.post("/register", utilities.handleErrors(accountController.registerAccount));


module.exports = router;