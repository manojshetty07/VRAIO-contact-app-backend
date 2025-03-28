import mysql from "mysql2/promise";

// Database connection configuration
const databaseConfig = {
  host: "localhost",
  user: "root", // Modify as necessary
  password: "", // Modify as necessary
  database: process.env.DB_NAME, // Set the DB name in .env file
  connectTimeout: 60000,
};

const dbPool = mysql.createPool({
  ...databaseConfig,
  connectionLimit: 10,
});

// Test database connection
function testDatabaseConnection() {
  return new Promise((resolve, reject) => {
    dbPool
      .getConnection()
      .then((connection) => {
        connection.release();
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { dbPool, testDatabaseConnection };
