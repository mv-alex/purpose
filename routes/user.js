const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const key = require("../config/keys").secret;
const jwt = require("jsonwebtoken");

/**
 * @route POST api/user/register
 * @desc Register the User
 * @access Public
 */
router.post("/register", async (req, res) => {
  let { username, pass, confirm_pass, name, email } = req.body;

  //check password match
  if (pass !== confirm_pass) {
    return res.status(400).json({
      msg: "Password do not match",
    });
  }
  //check the unicum username
  try {
    const usernameExsist = await User.findOne({
      where: {
        username: username,
      },
    });

    if (usernameExsist) {
      return res.status(400).json({
        msg: "Username is already exsist",
      });
    }

    //check the unicum email
    const emailExsist = await User.findOne({
      where: {
        email,
      },
    });

    if (emailExsist) {
      return res.status(400).json({
        msg: "Email is already exsist",
      });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(pass, 10);

    await User.create({
      username: username,
      pass: hashPassword,
      name: name,
      email: email,
    });

    return res.status(201).json({
      status: "success",
      msg: "User is now registered.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: "Server error, please try again or back later",
    });
  }
});

/**
 * @route POST api/user/login
 * @desc Login user
 * @access Public
 */
router.post("/login", async (req, res) => {
  let { username, pass } = req.body,
    user;

  try {
    //check user exsist
    user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    //password is match
    let isMatch = await bcrypt.compare(pass, user.pass);
    if (isMatch) {
      const payload = {
        id: user.id,
        username: user.username,
      };

      //set token
      jwt.sign(
        payload,
        key,
        {
          expiresIn: 604800,
        },
        (err, token) => {
          res.status(200).json({
            success: true,
            username: username,
            token: `Bearer ${token}`,
            user: user,
            msg: "Grate! You are now logged in.",
          });
        }
      );
    } else {
      return res.status(400).json({
        msg: "Incorrect password.",
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: "Server error, please try again or back later",
    });
  }
});

/**
 * @route GET api/user/profile
 * @desc User profile
 * @access Private
 */
router.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

module.exports = router;
