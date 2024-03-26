// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// LOGIN processes
// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin)
);

// Process the login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);
  
// REGISTER processes
// register route
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// POST requests
// process registration of Account
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// ACCOUNT PROCESSES
// account route
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAcctMgmt)
);

// Logout
router.get("/logout", function(req, res){
    res.clearCookie("sessionId");
    res.clearCookie("jwt");
    res.redirect("../");
});


module.exports = router;