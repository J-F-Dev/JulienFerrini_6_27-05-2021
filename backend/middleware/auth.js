const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //On extrait le token du header Authorization de la requête entrante. On utilise la fonction split pour récupérer tout après l'espace dans le header.
    const token = req.headers.authorization.split(" ")[1];
    //On utilise la fonction verify pour décoder notre token.
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //On extrait l'ID utilisateur de notre token ;
    const userId = decodedToken.userId;
    //Si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur.
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    }
    //Sinon si tout fonctionne, et notre utilisateur est authentifié, nous passons l'exécution.
    else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
