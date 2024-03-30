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

// Account Update View
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAcctUpdate))

// Route to update user Account details
router.post("/update/acct",
    regValidate.acctUpdateRules(),
    regValidate.checkAcctUpdate,
    utilities.handleErrors(accountController.accountUpdate))

// Route to change a user's password
router.post("/update/pwd",
    regValidate.pwdUpdateRules(),
    regValidate.checkPwdUpdate,
    utilities.handleErrors(accountController.passwordUpdate))

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout));


module.exports = router;