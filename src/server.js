//! --------------- Prerequisites ---------------
const express = require("express");
const cors = require("cors");
const { CLIENT_URL, env } = require("./config/config");
require("dotenv").config();
const routes = require("./api/routes");

//! ------ App Creation and Port declaration ------
const app = express();
const PORT = env.port;

//! ----------- Services Importations -----------
const mongoConnectionInit = require("./config/dataSource");
const configurePassport = require("./config/passportConfig");

//! ----------- Init App Configurations ---------
app.use(
  cors({
    origin: CLIENT_URL, // Allow to server to accept request from different origin.
    methods: "*",
    credentials: true, // Allow session cookie from browser to pass through.
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoConnectionInit();

app.use("/api/v1", routes);

configurePassport(app);

//! --------------- Listen to given PORT ---------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
