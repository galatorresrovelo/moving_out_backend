const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      isActive: "isActive",
    },
    (email, password, done) => {
      User.findOne({ email })
        .then((foundUser) => {
          if (!foundUser) {
            done(null, false, { message: "Incorrect email" });
            return;
          }
          if (!bcrypt.compareSync(password, foundUser.password)) {
            done(null, false, { message: "Incorrect password" });
            return;
          }
          if (!foundUser.isActive) {
            done(null, false, { message: "User is inactive" });
            return;
          }
          done(null, foundUser);
        })
        .catch((err) => done(err));
    }
  )
);
