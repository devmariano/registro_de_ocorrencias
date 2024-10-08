const express = require('express');
const router = express.Router();
const { alunos } = require('../data/data');

// Rota para obter alunos
router.get('/', (req, res) => {
    res.json(alunos);
});

module.exports = router;
