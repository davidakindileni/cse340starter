// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details by vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

module.exports = router;