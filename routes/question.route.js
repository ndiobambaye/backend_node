const express = require('express');
const auth = require('../middleware/user.middleware');
const {
  creerQuestion,
  listerQuestions,
  getQuestion,
  ajouterReponse,
} = require('../controllers/question.controller');

const router = express.Router();

router.get('/', listerQuestions);
router.get('/:id', getQuestion);
router.post('/', auth, creerQuestion);
router.post('/:id/reponses', auth, ajouterReponse);

module.exports = router;