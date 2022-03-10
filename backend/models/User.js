//On importe Mongoose et Mongoose-unique-validator
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//On crée notre modèle utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//On s'assure que deux utilisateurs ne puissent pas partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);

//On exporte le modèle
module.exports = mongoose.model("User", userSchema);
