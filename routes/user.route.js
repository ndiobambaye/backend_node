const express = require('express');
const { inscription, connexion, getProfil } = require('../controllers/user.controller');

const router = express.Router();
router.post("/inscription", inscription);
router.post("/connexion", connexion);
router.get("/utilisateurs/:id", getProfil);

module.exports = router;
