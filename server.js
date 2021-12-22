const express = require("express");
const cors = require("cors");
//const expressEjsLayout = require('express-ejs-layouts')
//const session = require('express-session');
//const flash = require('connect-flash');
const passport = require('passport');
//const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express();

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config()
}

require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate")

const userRouter = require("./routes/userRoutes")

var corsOptions = {
  origin: true,
  credentials:true,
};

app.use(cors(corsOptions));

//passport config:
//require('./config/passport')(passport)

// connect to Mongodb
const db = require("./models");
db.mongoose
  .connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET))


//express session
// app.use(session({
//   secret: 'secret',
//   resave: true,
//   saveUninitialized: true
// }));

app.use(passport.initialize());
//app.use(passport.session());

//use flash
// app.use(flash());
// app.use((req,res,next)=> {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error  = req.flash('error');
// next();
// })

//EJS
//app.set('view engine', 'ejs');
//app.use(expressEjsLayout);


//routers
require("./routes/dashboard.js")(app);
app.use("/users", userRouter)

// set port, listen for requests
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

