const express = require("express");
const router = express.Router();
const {User} = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const secret="secret_key";
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    // Check if email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by email or phone
    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    // Check if the user exists and the password is correct
    console.log(username,password)
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        secret,
        { expiresIn: "30d" }
      );
     return res.json({ token,role:user.role });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
