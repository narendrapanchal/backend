const express = require("express");
const jwt=require("jsonwebtoken");
const router = express.Router();
const {User} = require("../model/user.model");
const bcrypt = require("bcrypt");
const secret="secret_key";

module.exports = router;
