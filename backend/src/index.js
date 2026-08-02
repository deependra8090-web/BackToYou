const path = require("path");
const dotenv = require("dotenv");

// Set the default environment
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Current Environment: ${process.env.NODE_ENV}`);

// Load base .env first, then override with environment-specific file if present.
const baseEnvFile = path.resolve(__dirname, "..", ".env");
const envFile = path.resolve(__dirname, "..", `.env.${process.env.NODE_ENV}`);

const baseEnv = dotenv.config({ path: baseEnvFile });
if (baseEnv.error) {
  console.warn(`Could not load base env file at ${baseEnvFile}.`);
}

const envResult = dotenv.config({ path: envFile, override: true });
if (envResult.error) {
  console.warn(`Could not load environment-specific env file at ${envFile}. Using base .env values if available.`);
}

console.log(`Loaded environment variables from: ${baseEnvFile}${envResult.error ? "" : ` and ${envFile}`}`);

const express = require("express");
const mongoose = require("mongoose");
const configureApp = require("./settings/config.js");
const seedAdmin  = require("./seeders/seedAdmin.js");

const app = express();
const port = parseInt(process.env.PORT) || 3001;


//  Parsing request body
app.use(express.json());
configureApp(app);

async function bootstrap() {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL,
      { dbName: process.env.DATABASE_NAME }
    );
    console.log("Connnected To MongoDB");

    // Seed default admin once — reuses the existing connection
    await seedAdmin();

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });

  } catch (error) {
    console.error(error);
    /** An exit code of 1 typically indicates that there was an error or abnormal termination of the program, which is often used to signal failure in scenarios where the program encounters critical issues that prevent normal operation. */
    process.exit(1);
  }
}

bootstrap();

