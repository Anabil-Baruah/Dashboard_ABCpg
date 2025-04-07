const express = require("express");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { auth2, auth, baseURL } = require('../auth');
const { json } = require("body-parser");

dotenv.config();

const router = express.Router();

router.get("/login", auth2, async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
})
router.post("/login", async (req, res) => {
  try {
    // console.log("Route hit");

    const { username, password, role } = req.body;
    console.log(req.body)

    if (role === "admin") {
      let adminUser = await User.findOne({ role: "admin" });
      console.log(adminUser, "admin user")
      if (!adminUser) {
        console.log("No admin found, creating new one...");

        adminUser = new User({
          username,
          password: password,
          role: "admin",
        });
        const token = await adminUser.generateAuthToken();

        res.cookie('jwt', token, {
          httpOnly: true
        })
        const result = await adminUser.save();
        if (result) {
          return res.status(200).json({ status: "Success", message: "User created" })
        }
      }

      // Authenticate admin
      const passMatch = await bcrypt.compare(password, adminUser.password);
      console.log(passMatch, "password match")
      if (!passMatch) {
        return res.status(401).json({ status: "error", message: "Invalid credentials" });
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { username, role: "admin" },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.cookie('jwt', accessToken, {
        httpOnly: true
      })

      const update = await User.findOneAndUpdate({ role: "admin" }, { $set: { accessToken } });
      console.log(update, "updated")
      return res.status(200).json({ status: "Success", message: "User created" })
    }
    else if (role === "subadmin") {
      let subAdminUser = await User.findOne({ username, role: "subadmin" });
      console.log(subAdminUser, "subadmin user")
      if (!subAdminUser) {
        return res.status(401).json({ status: "error", message: "Subadmin does not exist" });
      }

      // Authenticate subadmin
      const passMatch = await bcrypt.compare(password, subAdminUser.password);
      if (!passMatch) {
        return res.status(401).json({ status: "error", message: "Invalid credentials" });
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { username, role: "subadmin" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie('jwt', accessToken, {
        httpOnly: true
      })
      const update = await User.findOneAndUpdate({ username, role: "subadmin" }, { $set: { accessToken } });
      console.log(update, "updated")
      return res.status(200).json({ status: "Success", message: "User created", userId: update._id })
    }
    else {
      return res.status(403).json({ status: "error", message: "Only admin and subadmin can access this route" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post('/signUp', async (req, res) => {
  console.log(req.body)
  try {
    // Get username, password, and role from the request body
    const { username, password, role, website } = req.body;

    // Ensure the role is set to "subadmin"
    if (role !== "subadmin") {
      return res.status(400).json({ message: "Only subadmin role can be created" });
    }

    // Check if the username or password is empty
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if subadmin already exists
    const existingSubadmin = await User.findOne({ username, role: "subadmin" });
    if (existingSubadmin) {
      return res.status(400).json({ message: "Subadmin with this username already exists" });
    }

    // Create new subadmin user
    const newSubadmin = new User({
      username,
      password,
      role: "subadmin",
      website
    });

    // Save the subadmin user to the database
    await newSubadmin.save();

    // Send response back to frontend
    return res.status(200).json({ message: "Subadmin created successfully!" });

  } catch (error) {
    console.error("Error during subadmin creation:", error);
    res.status(500).json({ message: "Something went wrong while creating subadmin" });
  }
});


router.get("/signup", async (req, res) => {
  try {

    res.render("signup");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch websites" });
  }
});


router.route('/logout')
  .get(auth, async (req, res) => {
    res.clearCookie('jwt');
    res.redirect(`${baseURL}/auth/login`)
  })

module.exports = router;
