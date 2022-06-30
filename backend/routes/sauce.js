const express = require('express');
const auth = require('auth');
const router = express.Router();


const  sauceCtrl = require('../controllers/sauce');

router.post('/', auth, sauceCtrl.createSauce);
// router.post('/:id/like', auth, sauceCtrl.likeDislike)
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;
