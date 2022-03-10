const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//on crée des routes post
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//On exporte le routeur
module.exports = router;
