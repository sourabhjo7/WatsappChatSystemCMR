const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../model/user");

//linked to /auth/register
exports.register = async (req, res) => {

  try {

    //getting details from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      creatorUID,
      assignedNumber,
      appName,
      apiKey
    } = req.body;

    //checking if all important fields exist
    if (!(firstName && lastName && email && password && role)) {
      res.status(422).send("All fields are required");
    }

    //checking the same role user is not creating a new user of same role
    if (req.userData.role !== role) {

      //checking if the user not already exist
      const existingUser = await User.findOne({
        email
      });
      if (existingUser) {
        return res.status(401).send("User already exist");
      }

      //hashing the password using bcrypt
      const encPassword = await bcrypt.hash(password, 10);

      let user;

      //setting the user based on the request role
      if(role === "Manager"){
        user = await User.create({
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: encPassword,
          role,
          assignedNumber,
          appName,
          apiKey
        });
      }else{
        user = await User.create({
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: encPassword,
          creatorUID,
          role
        });
      }

      //signing the jwt token
      const token = jwt.sign({
          user_id: user._id,
          email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`
        },
        process.env.SECRET_KEY, {
          expiresIn: "2h"
        }
      );

      user.token = token;

      //removing password so that it doen't go to frontend
      user.password = undefined;

      return res.status(201).json(user);
    } else {
      return res.status(403).send("Access Denide!! You can't add new a manager");
    }

  } catch (e) {
    console.log(e);
  }

}

//linked to /auth/login
exports.login = async (req, res) => {

  try {

    //getting details from the request body
    const {
      email,
      password
    } = req.body;

    //geting the user from the database
    const user = await User.findOne({
      email
    });

    //checking the password from the database of user by the input password
    if (user && (await bcrypt.compare(password, user.password))) {

      //signing jwt token
      const token = jwt.sign({
          user_id: user._id,
          email,
          role: user.role,
          creatorUID: user.creatorUID,
          name: `${user.firstName} ${user.lastName}`
        },
        process.env.SECRET_KEY, {
          expiresIn: "2h"
        }
      );

      //removing password so that it doen't go to frontend
      user.password = undefined;

      // Setting Up cookies
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true
      };

      return res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user
      });

    }

    res.status(400).send("Email or password incorrect");

  } catch (e) {
    console.log(e);
  }

}

//linked to /auth/login
exports.logout = (req, res) => {
  res.clearCookie('token').send("Done");
}
