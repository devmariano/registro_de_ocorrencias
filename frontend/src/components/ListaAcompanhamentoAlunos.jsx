import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function ListaAcompanhamentoAlunos({ alunos, ocorrencias }) {
  // Filtrar os alunos que possuem pelo menos um acompanhamento em andamento
  const alunosComAcompanhamentosEmAndamento = alunos
    .map(aluno => {
      // Filtrar os acompanhamentos em andamento do aluno atual
      const acompanhamentosEmAndamento = ocorrencias
        .filter(ocorrencia => ocorrencia.alunosEnvolvidos.includes(aluno.id))
        .flatMap(ocorrencia => ocorrencia.acompanhamentos)
        .filter(acomp => acomp.alunoId === aluno.id && acomp.status === 'andamento');

      // Obter a data da última atualização ou, se não houver, a data de criação do acompanhamento
      const datasUltimaAtualizacao = acompanhamentosEmAndamento.map(acomp => {
        if (acomp.atualizacoes && acomp.atualizacoes.length > 0) {
          return new Date(Math.max(...acomp.atualizacoes.map(atualizacao => new Date(atualizacao.dataHora))));
        } else if (acomp.dataCriacao) {
          return new Date(acomp.dataCriacao); // Agora a dataCriacao está registrada
        }
        return null;
      }).filter(date => date !== null);

      // Obter a data da última atualização mais antiga do aluno
      const ultimaAtualizacaoMaisAntiga = datasUltimaAtualizacao.length > 0 ? new Date(Math.min(...datasUltimaAtualizacao)) : null;

      return {
        ...aluno,
        acompanhamentosEmAndamento: acompanhamentosEmAndamento.length,
        ultimaAtualizacao: ultimaAtualizacaoMaisAntiga,
      };
    })
    .filter(aluno => aluno.acompanhamentosEmAndamento > 0)
    // Ordenar os alunos pela data da última atualização mais antiga
    .sort((a, b) => (a.ultimaAtualizacao - b.ultimaAtualizacao));

  // Renderizar apenas se houver alunos com acompanhamentos em andamento
  if (alunosComAcompanhamentosEmAndamento.length === 0) {
    return null;
  }

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Alunos com Acompanhamentos em Andamento
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Matrícula</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Acompanhamentos em Andamento</strong></TableCell>
              <TableCell><strong>Última Atualização</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunosComAcompanhamentosEmAndamento.map(aluno => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.acompanhamentosEmAndamento}</TableCell>
                <TableCell>{aluno.ultimaAtualizacao ? aluno.ultimaAtualizacao.toLocaleString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListaAcompanhamentoAlunos;
