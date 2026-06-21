const express = require('express');
const auth = require('../middleware/user.middleware');
const { inscription, connexion, getProfil, modifierProfil } = require('../controllers/user.controller');

const router = express.Router();
router.post("/inscription", inscription);
router.post("/connexion", connexion);
router.get("/utilisateurs/:id", getProfil);
router.put("/profil", auth, modifierProfil);

module.exports = router;