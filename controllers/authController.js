const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//handle errors
const handleErrors = (err) => {
  //   console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // duplicate error
  if (err.code === 11000) {
    errors.email = "that emails is already registered";
    return errors;
  }

  //   validation error
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // incorrect email
  if (err.message === 'incorrect email'){
    errors.email = 'this email is not registered'
  }

  // incorrect password
  if (err.message === 'incorrect password'){
    errors.password = 'this password is not correct'
  }
  return errors;
};

// handler
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  console.log("Request:", email, password);
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(201).send({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const user = await User.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({user: user._id});
  } catch (err) {
    const errors = handleErrors(err)
    console.log(err.message)
    res.status(400).json({errors})
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 1
  })
  res.redirect('/login')
}

const createToken = function (id) {
  return jwt.sign({ id }, "faraz secret", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
