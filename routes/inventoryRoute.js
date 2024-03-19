// Needed Resources 
const invValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

// Build inventory by classification view route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

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

// Build vehicle details for vehicle view route
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

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

// Build vehicle management Route
router.get("/", utilities.handleErrors(invController.buildVehicleMgmt));

// Get vehicle inventory by classification  route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to modify inventory (vehicle) details
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory));

// Route to update inventory (vehicle) details
router.post("/update/",
    invValidate.addNewVehRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to delete inventory (vehicle) item
router.get("/delete/:inv_id", utilities.handleErrors(invController.confirmDelete));

// Route to delete inventory (vehicle)
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))



module.exports = router;