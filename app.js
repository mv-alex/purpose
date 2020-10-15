const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const sequelize = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

// Middlewares
// Form Data Middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Json Body Middleware
app.use(bodyParser.json());

// Cors Middleware
app.use(cors());

// Use the passport Middleware
app.use(passport.initialize());
// Bring in the Passport Strategy
require("./config/passport")(passport);

//register user route
const user = require("./routes/user");
app.use("/api/user", user);

//register purpose route
const purpose = require("./routes/purpose");
app.use("/api/purpose", purpose);

//register task route
const task = require("./routes/task");
app.use("/api/task", task);

async function start() {
  try {
    //test the connection is OK
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  //sync models
  await sequelize.sync({ force: true });
  console.log("Models sync");
  app.listen(PORT, () => {
    console.log(`Server start listening...`);
  });
}

start();
