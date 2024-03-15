// Needed Resources 
const invValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details for vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Vehicle Management Route
router.get("/", utilities.handleErrors(invController.buildVehicleMgmt));

// Add New Classification Route
router.get("/addNewClass",
    utilities.handleErrors(invController.addNewClass)
);

// Process New Classification Route
router.post("/addNewClass",
    invValidate.addNewClassRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.processNewClass)
);

// Add New Vehicle Route
router.get("/addNewVeh",
    utilities.handleErrors(invController.addNewVeh)
);

// Process New Vehicle Route
router.post("/addNewVeh",
    invValidate.addNewVehRules(),
    invValidate.checkNewVehData,
    utilities.handleErrors(invController.processNewVeh)
);


module.exports = router;