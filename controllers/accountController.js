const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

const accountCont = {};

/* ****************************************
*  Deliver user login view
* *************************************** */
accountCont.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login", nav, errors: null});
  };
  
/* ****************************************
*  Deliver user registration view
* *************************************** */
accountCont.buildRegistration = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register", nav, errors: null});
};

/* ****************************************
*  Process New User Account Registration
* *************************************** */
accountCont.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}  

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations! You\'ve registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if ((!account_email) || (!account_password) || (!accountData)) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password))
    {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development')
      {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account")
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accountCont.buildAcctMgmt = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/management", {
    title: "Account Management", nav, errors: null});
};

/* ****************************************
*  Build Account Update
* *************************************** */
accountCont.buildAcctUpdate = async function(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  res.render("./account/update", {
    title: "Update " + accountData.account_firstname + " Account",
    nav,
    errors: null,
    account_id: account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_password: null,
  })
}

/* ****************************************
 *  Process Account Update
 * ************************************ */
accountCont.accountUpdate = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult) {
    req.flash("message", "Account successfully Updated.");
    const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry. The account update failed.");
      res.status(501).render("./account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    };
  }; 

/* ****************************************
*  Process User Password Change
* *************************************** */
accountCont.passwordUpdate = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email, account_password} = req.body
// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error changing the password.')
    res.status(500).render("account/update", {
      title: "Change Password",
      nav,
      errors: null,
      account_id,
      account_password: null,
    })
  }  

  const regResult = await accountModel.changePassword(
    account_id,
    hashedPassword
  )

  if (regResult) {
    req.flash("message", "Password has been successfully changed.")
    res.render("./account/management", {
      title: "Account Management", nav, errors: null});
    } else {
    req.flash("notice", "Sorry, the password change  failed.")
    res.status(501).render("./account/update", {
      title: "Change Password",
      nav,
      errors: null,
      account_id,
      account_password: null,
    })
  }
}

  /* ****************************************
*  Logout Process
* *************************************** */
accountCont.logout = async function(req, res, next) {
  res.clearCookie("sessionId");
  res.clearCookie("jwt");
  // req.flash("message", "You're logged out.");
  res.redirect("/");
};

module.exports = accountCont;
