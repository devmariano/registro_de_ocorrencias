import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

function ListaResumoOcorrencias({ ocorrencias, alunos }) {
  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Resumo das Ocorrências
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="resumo das ocorrências">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Alunos</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ocorrencias.map((ocorrencia) => (
              <TableRow key={ocorrencia.id}>
                <TableCell>{ocorrencia.id}</TableCell>
                <TableCell>{ocorrencia.tipo}</TableCell>
                <TableCell> 
                    {ocorrencia.alunosEnvolvidos.map(id => alunos.find(a => a.id == id)?.nome).join(', ')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircleIcon
                      sx={{
                        color: ocorrencia.status === 'andamento' ? 'green' : 'red',
                        marginRight: 1,
                      }}
                    />
                    {ocorrencia.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListaResumoOcorrencias;
