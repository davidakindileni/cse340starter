const reviewsModel = require("../models/reviews-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewsCont = {};


/* ***************************
 *  Return Reviews by Inventory ID As JSON
 * ************************** */
reviewsCont.getReviewsJSON = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    const reviewsData = await reviewsModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }
  
/* ***************************
 *  Add vehicle review
 * ************************** */
reviewsCont.addReview = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const vehData = await invModel.getInventoryByVehicleId(inv_id)
  const vehName = vehData[0].inv_make + ' ' + vehData[0].inv_model
  res.render("./inventory/add-review", {
    title: "Add Vehicle Review -- " + vehName,
    nav,
    errors: null,
    inv_id,
  })
}

/* ****************************************
*  Process New Vehicle Review 
* *************************************** */
reviewsCont.processNewReview = async function(req, res) {
  const {
    inv_id,
    account_id,
    review_rating,
    review_text
  } = req.body

  const classResult = await reviewsModel.addNewReview(
    inv_id,
    account_id,
    review_rating,
    review_text
  )
  let nav = await utilities.getNav()

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations! You\'ve added the review.`
    )
    res.status(201).render("./inventory/add-review", {
        title: "Add Vehicle Review",
        nav,
        errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
    res.status(501).render("./inventory/add-review", {
      title: "Add Vehicle Review",
      nav,
    })
  }
}



module.exports = reviewsCont