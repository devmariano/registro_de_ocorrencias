const express = require('express');
const router = express.Router();
const { ocorrencias } = require('../data/data');

// Rota para cadastrar uma nova ocorrência
router.post('/', (req, res) => {
    const { descricao, tipo, alunosEnvolvidos } = req.body;
    const novaOcorrencia = {
        id: ocorrencias.length + 1,
        descricao,
        tipo,
        alunosEnvolvidos,
        status: 'andamento',
        acompanhamentos: alunosEnvolvidos.map(alunoId => ({
            alunoId,
            descricao: `Acompanhamento do aluno ${alunoId} para a ocorrência.`,
            tipo,
            status: 'andamento',
            dataCriacao: new Date().toISOString(), // Adiciona data de criação
            atualizacoes: [] // Inicializa a lista de atualizações vazia
        })),
    };
    ocorrencias.push(novaOcorrencia);
    res.status(201).json(novaOcorrencia);
});

// Rota para listar todas as ocorrências
router.get('/', (req, res) => {
    res.json(ocorrencias);
});

// Rota para atualizar o status de um acompanhamento
router.put('/:id/acompanhamento/:alunoId', (req, res) => {
    const { id, alunoId } = req.params;
    const { status } = req.body;

    const ocorrencia = ocorrencias.find(o => o.id == id);
    if (ocorrencia) {
        const acompanhamento = ocorrencia.acompanhamentos.find(a => a.alunoId == alunoId);
        if (acompanhamento) {
            acompanhamento.status = status;

            // Verifica se todos os acompanhamentos estão encerrados
            const todosEncerrados = ocorrencia.acompanhamentos.every(a => a.status === 'encerrado');
            ocorrencia.status = todosEncerrados ? 'encerrado' : 'andamento';

            res.status(200).json(acompanhamento);
        } else {
            res.status(404).send('Acompanhamento não encontrado');
        }
    } else {
        res.status(404).send('Ocorrência não encontrada');
    }
});

// Rota para adicionar atualizações ao acompanhamento
router.post('/:id/acompanhamento/:alunoId/atualizacao', (req, res) => {
    const { id, alunoId } = req.params;
    const { texto, tipo, categoria } = req.body;

    const ocorrencia = ocorrencias.find(o => o.id == id);
    if (ocorrencia) {
        const acompanhamento = ocorrencia.acompanhamentos.find(a => a.alunoId == alunoId);
        if (acompanhamento) {
            const novaAtualizacao = {
                dataHora: new Date().toISOString(),
                texto,
                tipo, // Tipo da atualização (opcional)
                categoria, // Categoria da atualização (acompanhamento ou encaminhamento)
            };
            acompanhamento.atualizacoes.push(novaAtualizacao);
            res.status(201).json(novaAtualizacao);
        } else {
            res.status(404).send('Acompanhamento não encontrado');
        }
    } else {
        res.status(404).send('Ocorrência não encontrada');
    }
});

module.exports = router;
