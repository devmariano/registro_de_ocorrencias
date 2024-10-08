const express = require('express');
const cors = require('cors');

const alunosRoutes = require('./routes/alunos');
const ocorrenciasRoutes = require('./routes/ocorrencias');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/alunos', alunosRoutes);
app.use('/api/ocorrencias', ocorrenciasRoutes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
