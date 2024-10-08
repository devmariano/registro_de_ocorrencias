import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Switch, List, ListItem, Divider, Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

function ListaOcorrencias({ ocorrencias, alunos, onAlterarStatus }) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ocorrências Cadastradas
      </Typography>
      {ocorrencias.length === 0 ? (
        <Typography variant="body1">Nenhuma ocorrência cadastrada.</Typography>
      ) : (
        ocorrencias.map(ocorrencia => (
          <Card key={ocorrencia.id} sx={{ marginBottom: 3 }} elevation={3}>
            <CardContent>
              <Typography variant="h6">{ocorrencia.descricao}</Typography>
              <Typography color="text.secondary">
                Tipo: {ocorrencia.tipo} - Status: {ocorrencia.status}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Envolvidos: {ocorrencia.alunosEnvolvidos.map(id => alunos.find(a => a.id == id)?.nome).join(', ')}
              </Typography>
              <List sx={{ marginTop: 2 }}>
                {ocorrencia.acompanhamentos.map(acompanhamento => (
                  <React.Fragment key={acompanhamento.alunoId}>
                    <ListItem>
                      <Grid container alignItems="center">
                        <Grid item>
                          {/* Indicador de Status */}
                          <CircleIcon 
                            sx={{
                              color: acompanhamento.status === 'andamento' ? 'green' : 'red',
                              marginRight: 1,
                            }}
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body1">
                            Acompanhamento do aluno {acompanhamento.alunoId} - Status: {acompanhamento.status}
                          </Typography>
                        </Grid>
                        <Grid item>
                          {/* Toggle Switch para Alterar o Status */}
                          <Switch
                            checked={acompanhamento.status === 'encerrado'}
                            onChange={() => {
                              const novoStatus = acompanhamento.status === 'andamento' ? 'encerrado' : 'andamento';
                              onAlterarStatus(ocorrencia.id, acompanhamento.alunoId, novoStatus);
                            }}
                            color="primary"
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default ListaOcorrencias;
