const Question = require('../models/question.model');
const Reponse = require('../models/reponse.model');

// Creer une question
exports.creerQuestion = async (req, res) => {
  try {
    const { titre, contenu, tags } = req.body;
    const question = await Question.create({
      titre,
      contenu,
      tags: tags || [],
      auteur: req.user.id,
    });
    res.status(201).json({ message: 'Question creee', question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Lister toutes les questions
exports.listerQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('auteur', 'prenom nom')
      .sort({ createdAt: -1 });
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Recuperer une question + ses reponses
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('auteur', 'prenom nom');
    if (!question) {
      return res.status(404).json({ message: 'Question introuvable' });
    }
    const reponses = await Reponse.find({ question: req.params.id })
      .populate('auteur', 'prenom nom')
      .sort({ createdAt: 1 });
    res.json({ question, reponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une reponse a une question
exports.ajouterReponse = async (req, res) => {
  try {
    const { contenu } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question introuvable' });
    }
    const reponse = await Reponse.create({
      contenu,
      auteur: req.user.id,
      question: req.params.id,
    });
    res.status(201).json({ message: 'Reponse ajoutee', reponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};