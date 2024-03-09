// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")


// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// register route
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// process registration of Account
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors((req, res) => {
      res.status(200).send('Login succesful')
    })
);
  
module.exports = router;