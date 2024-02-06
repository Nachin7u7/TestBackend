// --------------- Prerequisites ---------------
const express = require("express");
const cors = require("cors");
const { CLIENT_URL } = require("./src/config/config");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5555;
const mongoConnectionInit = require("./src/config/dataSource");

app.use(
  cors({
    origin: CLIENT_URL, // Allow to server to accept request from different origin.
    methods: "*",
    credentials: true, // Allow session cookie from browser to pass through.
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --------------- Passport Config ---------------
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./src/models/user.model");
const env = process.env.NODE_ENV || "development";

// ----- Configure auth session options -----
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // Cookie expiry time = 1 month (in milliseconds)
  },
};

if (env == "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionOptions.cookie.sameSite = "none";
  sessionOptions.cookie.secure = true;
  sessionOptions.cookie.domain = "netlify.app";
}
app.use(session(sessionOptions));

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    User.authenticate()
  )
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("./"));

passport.serializeUser((user, done) => {
  const sessionUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    userType: user.userType,
  };
  done(null, sessionUser);
});
passport.deserializeUser((sessionUser, done) => {
  done(null, sessionUser);
});

// --------------- Routes ---------------
const userRouter = require("./src/routes/userRouter");
app.use("/users", userRouter);
const problemCreationRouter = require("./src/routes/problemCreationRouter");
app.use("/problemCreation", problemCreationRouter);
const problemRouter = require("./src/routes/problemRouter");
app.use("/problem", problemRouter);

// --------------- Connect to MongoDB ---------------
// const uri = "mongodb+srv://andercaymi:Standbyme1@cluster0.ngncwfr.mongodb.net/?retryWrites=true&w=majority";
// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: 'test', // Replace with your actual database name if different
//   })
//   .then(() => {
//     console.log("MongoDB database connection established successfully");
//   })
//   .catch((err) => console.error(err));

mongoConnectionInit();

// --------------- Listen to given PORT ---------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
