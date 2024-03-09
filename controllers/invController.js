const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details by vehicle view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getInventoryByVehicleId(vehicle_id)
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  const vehName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/vehicle", {
    title: vehName,
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleMgmt = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Add new classification view
 * ************************** */
invCont.addNewClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Add New Classification
* *************************************** */
invCont.processNewClass = async function(req, res) {
  const { classification_name } = req.body

  const classResult = await invModel.addNewClass(
    classification_name
  )
  let nav = await utilities.getNav()

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations! You\'ve added ${classification_name}.`
    )
    res.status(201).render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ***************************
 *  Build Add new vehicle view
 * ************************** */
invCont.addNewVeh = async function (req, res, next) {
  let nav = await utilities.getNav()
  const vehClass = await utilities.buildClassSelectOption()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    vehClass,
    errors: null,
  })
}

/* ****************************************
*  Process Add New Vehicle
* *************************************** */
invCont.processNewVeh = async function(req, res) {
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

  const vehResult = await invModel.addNewVeh(
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
  )
  let nav = await utilities.getNav()

  if (vehResult) {
    req.flash(
      "notice",
      `Congratulations! You\'ve added ${inv_make} ${inv_model}.`
    )
    res.status(201).render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding the new vehicle failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
    })
  }
}

module.exports = invCont