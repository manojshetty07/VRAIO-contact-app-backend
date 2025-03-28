import { app } from "./app.js";
import { testDatabaseConnection } from "./db/databaseConnection.js";

const port = process.env.PORT || 8080;
testDatabaseConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}/`);
    });
  })
  .catch((_) => {
    console.error("Failed to connect to the database");
    process.exit(1);
  });
