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

    const questionsAvecCompte = await Promise.all(
      questions.map(async (q) => {
        const nbReponses = await Reponse.countDocuments({ question: q._id });
        return { ...q.toObject(), nbReponses };
      })
    );

    res.json({ questions: questionsAvecCompte });
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
// Voter pour une question (+1 ou -1)
exports.voterQuestion = async (req, res) => {
  try {
    const { valeur } = req.body; // 1 ou -1
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: valeur } },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Question introuvable' });
    }
    res.json({ votes: question.votes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Voter pour une reponse (+1 ou -1)
exports.voterReponse = async (req, res) => {
  try {
    const { valeur } = req.body;
    const reponse = await Reponse.findByIdAndUpdate(
      req.params.repId,
      { $inc: { votes: valeur } },
      { new: true }
    );
    if (!reponse) {
      return res.status(404).json({ message: 'Reponse introuvable' });
    }
    res.json({ votes: reponse.votes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
// Lister tous les tags avec leur nombre de questions
exports.listerTags = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};