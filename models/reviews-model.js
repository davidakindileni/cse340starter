const pool = require("../database/")

/* ***************************
 *  Get vehicle details by vehicle_id
 * ************************** */
async function getReviewsByVehicleId(vehicle_id) {
    try {
      const reviewData = await pool.query(
        `SELECT * FROM public.reviews AS i 
        JOIN public.account AS a 
        ON i.account_id = a.account_id 
        WHERE i.inv_id = $1`,
        [vehicle_id]
      )
      return reviewData.rows
    } catch (error) {
      console.error("getReviewsByVehicleId error " + error)
    }
  }
  
  /* *****************************
*   Add new vehicle review
* *************************** */
async function addNewReview(
  inv_id,
  account_id,
  review_rating,
  review_text,
  ){
  try {
    const sql =
    "INSERT INTO reviews (inv_id, account_id, review_rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [inv_id, account_id, review_rating, review_text]);
  } catch (error) {
    return error.message;
  }
};


  module.exports = {getReviewsByVehicleId, addNewReview}