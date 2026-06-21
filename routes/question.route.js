const express = require('express');
const auth = require('../middleware/user.middleware');
const {
  creerQuestion,
  listerQuestions,
  getQuestion,
  ajouterReponse,
  voterQuestion,
  voterReponse,
} = require('../controllers/question.controller');

const router = express.Router();

router.get('/', listerQuestions);
router.get('/:id', getQuestion);
router.post('/', auth, creerQuestion);
router.post('/:id/reponses', auth, ajouterReponse);
router.post('/:id/vote', auth, voterQuestion);
router.post('/:qid/reponses/:repId/vote', auth, voterReponse);

module.exports = router;