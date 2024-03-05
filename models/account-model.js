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

module.exports = acctModel; 