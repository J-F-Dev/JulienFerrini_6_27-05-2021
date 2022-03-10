//On importe express
const express = require("express");
//On appelle la méthode express
const app = express();

const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");

//On connecte notre API à notre cluster MongoDB
mongoose
  .connect(
    "mongodb+srv://julien:mongodbopen@cluster0.tctvm.mongodb.net/julien?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//On analyse le corps de la requête.
app.use(express.json());

//On permet à l'application d'accéder à l'API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//On gère la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images .
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//on exporte l'application
module.exports = app;
