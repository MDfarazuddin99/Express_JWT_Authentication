const jwt = require("jsonwebtoken");
const User = require("../models/User");

requireAuth = (req, res, next) => {
  const token = req.cookie.jwt;
  if (token) {
    jwt.verify(token, "faraz secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        console.log('Token Found ', token)
      jwt.verify(token, 'faraz secret', async (err, decodedToken) => {
        if (err) {
            console.log('token verified false')
          res.locals.user = null;
          next();
        } else {
            console.log('token verified ', decodedToken)
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
  

module.exports = { requireAuth, checkUser};
