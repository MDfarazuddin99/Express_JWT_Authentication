const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a passowrd"],
    minlength: [6, "Minimum password length is 6"],
  },
});
// fire function after doc saved to db
userSchema.post("save", function (doc, next) {
  console.log("new user was created and saved", doc);
  next();
});

// fire function before doc saved to db
userSchema.pre("save", async function (next) {
  //   console.log("user about to be created & saved", this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.statics.login = async function(email, password){
  const user = await this.findOne({email});
  if(user){
    console.log('User Found')
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model("user", userSchema);

module.exports = User;
