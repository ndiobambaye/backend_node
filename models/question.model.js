const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  tags: [{ type: String }],
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);