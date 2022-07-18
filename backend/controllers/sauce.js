const Sauce = require('../models/Sauce')
const fs = require('fs');

exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   const sauce = new Sauce({
       ...sauceObject,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
   });
   sauce.save()
   .then(() =>  res.status(201).json({message: 'Objet enregistré !'}))
   .catch(error =>  res.status(400).json({message: "Problème d'enregistrement de la sauce créé !"}))
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

if(req.body.userId == sauceObject.userId) {
   Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
      .then(()=> res.status(200).json({message : 'Sauce modifiée !'}))
      .catch(error => res.status(401).json({message : "Problème de mise à jour des données de votre sauce !" }));
  }
};

exports.deleteSauce =  (req, res, next)=>{
if(req.body.userId == Sauce.userId) {
   Sauce.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch( error => res.status(401).json({ message : "Problème pour récupérer la sauce à suppprimer !" }));
}
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((Sauce) => res.status(201).json(Sauce))
    .catch(error => res.status(404).json({ message: "Problème d'identification de la sauce !" }));
};

exports.getAllSauces = (req, res, next)=> {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({message : "Problème de récupération de l'ensemble des sauces !"}))
};

exports.likeDislike = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne({_id: req.params.id}, {
          $inc: {likes: +1},
          usersLiked: req.body.userId })
            .then(sauce => res.status(200).json({message: 'Like ajouté !'}))
            .catch(error => res.status(400).json({message: "Problème d'ajout du like !"}))
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: {dislikes: +1},
          usersDisliked: req.body.userId })
            .then(sauce => res.status(200).json({message: 'Dislike ajouté !'}))
            .catch(error => res.status(400).json({message: "Problème d'ajout du dislike !"}))
    }
    else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                      { $pull: {
                    usersLiked: req.body.userId},
                    $inc: {likes: -1 }})
                        .then(sauce => { res.status(200).json({message: 'Like supprimé !'}) })
                        .catch(error => res.status(400).json({message: "Problème de suppression du like !"}))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id },{$pull: { usersDisliked: req.body.userId},
                      $inc: {dislikes: -1 }})
                        .then(sauce => { res.status(200).json({message: 'Dislike supprimé !'}) })
                        .catch(error => res.status(400).json({message: "Problème de suppression du dislike !"}))
                }
            })
            .catch(error => res.status(400).json({ message: "Problème d'identification de la sauce pour le vote !" }))
    }
};
