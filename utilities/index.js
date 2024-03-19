const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="veh-card">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"  target="_blank"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details"  target="_blank">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<p><span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></p>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle details view HTML
* ************************************ */
Util.buildVehicleGrid = async function(data){
  let grid
  let vehicle = data[0]
  if(data.length > 0){
    grid = '<div class="vehdet-container">'
        grid += '<div class="vehdet-grid">'
            grid += '<div><img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '"></div>'
            grid += '<div class="veh-particulars">'
                grid += '<h2>' + vehicle.inv_make + ' '+ vehicle.inv_model + ' ' + 'Details </h2>'
                grid += '<p class="price"><span class="price-label">Price: </span><span class="price-value">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></p>'
                grid += '<p class="description"><span class="description-label">Description: </span><span class="description-value"> ' + vehicle.inv_description + '</span></p>'
                grid += '<p class="color"><span class="color-label">Color: </span><span class="color-value"> ' + vehicle.inv_color + '</span></p>'
                grid += '<p class="miles"><span class="miles-label">Miles: </span><span class="miles-value"> ' 
                + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span></p>'
                grid += '</div>'
        grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification Select Option  HTML
* ************************************ */
Util.buildClassSelectOption = async function (req, res, next) {
  let data = await invModel.getClassifications()
  list = '<select name="classification_id" id="classificationList" autofocus required>'
  list += '<option value="">-- Choose a classification --</option>'
  data.rows.forEach((row) => {
    list += '<option value="' + row.classification_id + '">'
    // if (classification_id != null &&  row.classification_id == classification_id){
    //   list += " selected ";
    // }
    list += row.classification_name + '</option>'
  })
  list += "</select>"
  return list
}// Util.buildClassSelectOption = async function (req, res, next) {
//   let data = await invModel.getClassifications()
//   list = ""
//   list = '<select name="classification_id" id="classificationList" autofocus required>'
//   list += '<option>-- Choose a classification --</option>'
//   data.rows.forEach((row) => {
//     list += '<option value="' + row.classification_id + '"';
//     // console.log("classification_id", classification_id, "row.classification_id", row.classification_id)
//     // if (classification_id != null &&  row.classification_id == classification_id){
//     //   list += " selected ";
//     // }
//     list += ">" + row.classification_name + "</option>";
//   });
//   list += "</select>";
//   return list
// }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util