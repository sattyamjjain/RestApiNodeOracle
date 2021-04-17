const oracleDb = require("oracledb");
const dbConfig = require("../config/db.config.js");

const connection = null;

async function getConnection() {
  connection = oracleDb.getConnection({
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    connectString: dbConfig.CONNECTION_STRING,
  });
}

getConnection();

module.exports = connection;
