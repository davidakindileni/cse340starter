const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and must exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
          throw new Error("Email does not exist. Please log in or use a correct email")
        }
      }),
        
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

  /* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
        
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  
/*  **********************************
 *  Add New Vehicle Classification Rules
 * ********************************* */
validate.addNewClassRules = () => {
  return [
    // Classification name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClass(classification_name)
        if (classExists) {
          throw new Error("Class name exists. Please enter a unique classification name.")
        }
      }),
  ]
}

  /* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Add New Vehicle Data Validation Rules
 * ********************************* */
validate.addNewVehRules = () => {
  return [
    // vehicle classification id is required and must be integer
    body("classification_id")
      .trim()
      // .isInt()
      .not().isEmpty()
      .withMessage("Please provide a vehicle classification id."), // on error this message is sent.

    // vehicle make is required and must be string
    body("inv_make")
      .trim()
      .not().isEmpty()
      // .isLength({ min: 3 })
      .withMessage("Please provide a vehicle make."), // on error this message is sent.

    // vehicle model is required and must be string
    body("inv_model")
      .trim()
      .not().isEmpty()
      .withMessage("Please provide a vehicle model."), // on error this message is sent.

    // vehicle description is required and must be string
    body("inv_description")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please provide a vehicle description."), // on error this message is sent.

    // vehicle image is required
    body("inv_image")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please provide a vehicle image path."), // on error this message is sent.

    // vehicle thumbnail is required 
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please provide a vehicle thumbnail path."), // on error this message is sent.

    // vehicle price is required and must be string
    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("Please provide a vehicle price."), // on error this message is sent.

    // vehicle year is required
    body("inv_year")
      .trim()
      .isInt()
      .withMessage("Please provide a vehicle year."), // on error this message is sent.

    // vehicle miles is required and must be string
    body("inv_miles")
      .trim()
      .isInt()
      .withMessage("Please provide a vehicle mileage."), // on error this message is sent.

    // vehicle color is required and must be string
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle color."), // on error this message is sent.
  ]
}

  /* ******************************
 * Check data and return errors or continue to add new new vehicle data
 * ***************************** */
  validate.checkNewVehData = async (req, res, next) => {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      } = req.body
    const vehClass = await utilities.buildClassSelectOption(classification_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        vehClass: vehClass,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }


  
module.exports = validate