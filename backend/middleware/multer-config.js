const multer = require("multer");

//On crée notre dictionnaire
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//On crée une constante storage, à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants.
const storage = multer.diskStorage({
  //On indique à multer d'enregistrer les fichiers dans le dossier images.
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //On  indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier.
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//On exporte l'élément multer entièrement configuré, on lui passe notre constante storage et on lui indique que nous gérerons uniquement les téléchargements de fichiers image.
module.exports = multer({ storage: storage }).single("image");
