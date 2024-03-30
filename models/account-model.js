const pool = require("../database/index")

const acctModel = {};

/* Register new   */
acctModel.registerAccount = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
    try {
      const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
      return error.message;
    }
  };

/* **********************
 *   Check for existing email
 * ********************* */
acctModel.checkExistingEmail = async function(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
acctModel.getAccountByEmail = async function(account_email){
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account Id
* ***************************** */
acctModel.getAccountById = async function(account_id){
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
*   Update Account details
* *************************** */
acctModel.updateAccount = async function (
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql =
    "UPDATE public.account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      account_id,
      account_firstname,
      account_lastname,
      account_email,
        ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
*   Update User Password details
* *************************** */
acctModel.changePassword = async function (
  account_id,
  account_password
) {
  try {
    const sql =
    "UPDATE public.account SET account_password = $2 WHERE account_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      account_id,
      account_password,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



module.exports = acctModel; 