// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details by vehicle view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

module.exports = router;