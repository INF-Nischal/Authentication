const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    if (password !== cpassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await User.create({
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword,
    });

    res.status(201).json({ message: "User registered." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
      return res.status(401).json({ error : "Invalid Credentials" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    res.json({ message: "Login Successful" });

  } catch (error) {
    console.log(error);

    res.json(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const exisitingUser = await User.findById(userId);

    if(!exisitingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await exisitingUser.deleteOne();

    res.status(200).json({message: "User deleted Successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.patch("/reset/:id", async (req, res) => {
  try {

    const { email, password, cpassword } = req.body;

    if(password !== cpassword) {
      return res.status(400).json({ error: "Password doen't match"});
    }

    const exisitingUser = await User.findOne({ email });

    if(!exisitingUser) {
      return res.status(404).json({ error: "User not found"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    exisitingUser.password = hashedPassword;

    await exisitingUser.save();

    res.status(200).json({ message: "Password updated successfully"});

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
