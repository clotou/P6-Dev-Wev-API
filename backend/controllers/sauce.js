const Sauce = require('../models/Sauce')

// exports.createSauce = (req, res, next) => {
//   const sauceObject = JSON.parse(req.body.sauce);
//   delete sauceObject._id;
//   delete sauceObject._userId;
//   const sauce = new Sauce({
//     ...sauceObject,
//     userId: req.auth.userId,
//     imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
//   });
//   sauce.save()
//   .then(() => {req.status(201).json({message: 'Objet enregistré !'})})
//   .catch(error => {res.status(400).json( { error } )})
// };

exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauce = new Sauce({
       ...sauceObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

   sauce.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parese(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {
    if(sauce.userId != req.auth.userId) {
      res.status(401).json({ message : 'Non aurorisé !'})
    } else {
      Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
      .then(()=> res.status(200).json({message : 'Objet modifié'}))
      .catch(error => res.status(401).json({ error }));
    }
  })
  .catch((error)=>{
    res.status(400).json({error});
  })
  // sauce.updateOne({_id: req.params.id}, { ...req.body, _id: req.params.id})
  //   .then(() => res.status(201).json({message: "Sauce modifiée !"}))
  //   .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce =  (req, res, next)=>{
  sauce.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: "Sauce Supprimé !"}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  sauce.findOne({_id: req.params.id})
    .then(() => res.status(201).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next)=> {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
};

//exports.likeDislike = (req, res, next) => {
//   sauce.findOne({_id: req.params.id})
//     .then(() => res.status(201).json(sauce))
//     .catch(error => res.status(404).json({ error }));
// };
