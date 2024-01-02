const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { register, login, remove, changePassword } = require("../controllers/UserController");

router.post("/register", register);

router.post("/login", login);

router.delete("/delete/:id", remove);

router.patch("/reset/:id", verifyToken, changePassword);

module.exports = router;
