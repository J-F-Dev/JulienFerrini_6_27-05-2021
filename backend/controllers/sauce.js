const Sauce = require("../models/Sauce");
//On importe le package fs de node
const fs = require("fs");

//On récupère toutes les sauces avec find
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

//On récupère une sauce grâce à son id avec findOne
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//On crée la sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //On supprime le champ id du corps de la requête
  delete sauceObject._id;
  //On crée une nouvelle instance de notre modèle sauce
  const sauce = new Sauce({
    ...sauceObject,
    //On génère l'url de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });
  //On enregiste l'objet dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//On modifie une sauce
exports.updateSauce = (req, res, next) => {
  //On verifie que req.file existe
  const sauceObject = req.file
    ? {
        //Si le fichier existe, on récupère les informations sur l'objet
        ...JSON.parse(req.body.sauce),
        //On génère l'url de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //On modifie en comparant avec l'id
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

//On supprime une sauce
exports.deleteSauce = (req, res, next) => {
  //On cherche le fichier avec l'id dans les paramètres de la requete
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //On récupère le nom du fichier
      const filename = sauce.imageUrl.split("/images/")[1];
      //On supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        //On supprime la sauce en comparant avec l'id
        Sauce.deleteOne({ _id: req.params.id })
          .then(res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//On gère les likes et dislikes
exports.likeDislikeSauce = (req, res, next) => {
  switch (req.body.like) {
    //Si like = 1
    case 1:
      //On incremente 1 dans les likes
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }));

      break;

    //Si like = 0
    case 0:
      //On cherche la sauce correspondante à l'id en paramètre
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          //Si l'utilisateur a déjà mis un like on décrémente
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
          //Si l'utilisateur a déjà mis un dislike on décrémente
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    //Si like = -1
    case -1:
      //On incremente 1 dans les dislikes
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
      )
        .then(() => {
          res.status(200).json({ message: `Je n'aime pas` });
        })
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log(error);
  }
};
