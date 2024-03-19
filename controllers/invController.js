const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classificationList = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classificationList)
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
  const classificationSelect = await utilities.buildClassSelectOption()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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
  const classification_id = parseInt(req.params.classification_id)
  const vehClass = await utilities.buildClassSelectOption(classification_id)
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    vehClass: vehClass,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  build edit inventory (vehicle) view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const class_id = parseInt(req.params.classification_id)
  let nav = await utilities.getNav()
  const vehData = await invModel.getInventoryByVehicleId(inv_id)
  const vehClass = await utilities.buildClassSelectOption(vehData[0].classification_id)
  const vehName = `${vehData[0].inv_make} ${vehData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + vehName,
    nav,
    vehClass: vehClass,
    errors: null,
    inv_id: vehData[0].inv_id,
    inv_make: vehData[0].inv_make,
    inv_model: vehData[0].inv_model,
    inv_year: vehData[0].inv_year,
    inv_description: vehData[0].inv_description,
    inv_image: vehData[0].inv_image,
    inv_thumbnail: vehData[0].inv_thumbnail,
    inv_price: vehData[0].inv_price,
    inv_miles: vehData[0].inv_miles,
    inv_color: vehData[0].inv_color,
    classification_id: vehData[0].classification_id
  })
}

module.exports = invCont