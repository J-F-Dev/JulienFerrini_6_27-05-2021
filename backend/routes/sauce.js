const express = require("express");
//On crée un router
const router = express.Router();
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

const sauceCtrl = require("../controllers/sauce");

//On crée les routes
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

//On exporte le router
module.exports = router;
