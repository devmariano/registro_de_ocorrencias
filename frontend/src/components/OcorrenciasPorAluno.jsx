import React, { useState } from 'react';
import { Box, Typography, Card, Accordion, AccordionSummary, AccordionDetails, Switch, Divider, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, CardContent, MenuItem, Select, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';

function OcorrenciasPorAluno({ alunos, ocorrencias, onAlterarStatus, refreshComponent }) {
  const [novasAtualizacoes, setNovasAtualizacoes] = useState({}); // Estado para armazenar as novas atualizações de cada acompanhamento
  const [tipoAcompanhamento, setTipoAcompanhamento] = useState({}); // Estado para armazenar se é acompanhamento ou encaminhamento
  const [tipoAtualizacao, setTipoAtualizacao] = useState({}); // Estado para armazenar o tipo de cada atualização ou tipo de encaminhamento (interno/externo)

  const handleAtualizacaoChange = (ocorrenciaId, alunoId, valor) => {
    const chave = `${ocorrenciaId}-${alunoId}`;
    setNovasAtualizacoes(prevState => ({
      ...prevState,
      [chave]: valor,
    }));
  };

  const handleTipoAcompanhamentoChange = (ocorrenciaId, alunoId, valor) => {
    const chave = `${ocorrenciaId}-${alunoId}`;
    setTipoAcompanhamento(prevState => ({
      ...prevState,
      [chave]: valor,
    }));
    // Limpa o tipo de atualização anterior
    setTipoAtualizacao(prevState => ({
      ...prevState,
      [chave]: '',
    }));
  };

  const handleTipoAtualizacaoChange = (ocorrenciaId, alunoId, valor) => {
    const chave = `${ocorrenciaId}-${alunoId}`;
    setTipoAtualizacao(prevState => ({
      ...prevState,
      [chave]: valor,
    }));
  };

  const adicionarAtualizacao = async (ocorrenciaId, alunoId) => {
    const chave = `${ocorrenciaId}-${alunoId}`;
    const novaAtualizacaoTexto = novasAtualizacoes[chave];
    const novaAtualizacaoCategoria = tipoAcompanhamento[chave];
    const novaAtualizacaoTipo = tipoAtualizacao[chave];

    try {
      // Salvar nova atualização no backend
      const response = await fetch(`http://localhost:3000/api/ocorrencias/${ocorrenciaId}/acompanhamento/${alunoId}/atualizacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          texto: novaAtualizacaoTexto,
          categoria: novaAtualizacaoCategoria,
          tipo: novaAtualizacaoTipo,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar a atualização');
      }

      // Limpa os campos de atualização específicos após salvar
      setNovasAtualizacoes(prevState => ({
        ...prevState,
        [chave]: '',
      }));

      setTipoAcompanhamento(prevState => ({
        ...prevState,
        [chave]: '',
      }));

      setTipoAtualizacao(prevState => ({
        ...prevState,
        [chave]: '',
      }));

      // Chama a função para recarregar o componente principal
      refreshComponent();

    } catch (error) {
      console.error("Erro ao adicionar atualização:", error);
    }
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Painel do aluno
      </Typography>
      {alunos.map(aluno => {
        const ocorrenciasDoAluno = ocorrencias.filter(ocorrencia =>
          ocorrencia.alunosEnvolvidos.includes(aluno.id)
        );

        if (ocorrenciasDoAluno.length === 0) {
          return null;
        }

        return (
          <Card key={aluno.id} sx={{ marginBottom: 4, backgroundColor: "#fff" }}>
            <CardContent>
              <Box marginBottom={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold'}}>
                Nome: {aluno.nome} - Matrícula: {aluno.matricula}
              </Typography>
              <Divider/>
              </Box>
              <Typography variant="h7" sx={{ fontWeight: 'bold'}}>
                Acompanhamentos
              </Typography>

              {ocorrenciasDoAluno.map(ocorrencia => {
                const acompanhamentoAluno = ocorrencia.acompanhamentos.find(acomp => acomp.alunoId === aluno.id);
                
                if (!acompanhamentoAluno) {
                  return null;
                }

                const chaveAcompanhamento = `${ocorrencia.id}-${aluno.id}`;

                return (
                  <Accordion key={ocorrencia.id} sx={{ marginBottom: 2, backgroundColor: "#f9f9f9" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-content-${ocorrencia.id}`} id={`panel-header-${ocorrencia.id}`}>
                      <Box sx={{ width: '100%' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={1.5}>
                            <Typography variant="body1">
                              <strong>ID:</strong> {ocorrencia.id}
                            </Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography variant="body1">
                              <strong>Tipo:</strong> {ocorrencia.tipo}
                            </Typography>
                          </Grid>
                          <Grid item xs={2.5} sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon
                              sx={{
                                color: acompanhamentoAluno.status === 'andamento' ? 'green' : 'red',
                                marginRight: 1,
                              }}
                            />
                            <Typography variant="body1">
                              <strong>Status:</strong> {acompanhamentoAluno.status}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                              <Switch
                                checked={acompanhamentoAluno.status === 'encerrado'}
                                onChange={() => {
                                  const novoStatus = acompanhamentoAluno.status === 'andamento' ? 'encerrado' : 'andamento';
                                  onAlterarStatus(ocorrencia.id, aluno.id, novoStatus);
                                }}
                                color="primary"
                              />
                              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                                {acompanhamentoAluno.status === 'andamento' ? 'Encerrar' : 'Reabrir'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* Campos de Atualização */}
                      <Typography variant="body1" marginBottom={2}>
                        <strong>Descrição:</strong> {ocorrencia.descricao}
                      </Typography>
                      {acompanhamentoAluno.status === 'andamento' && (
                        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                          <Divider />
                          <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}>
                          Atualizações:
                          </Typography>
                          <TextField
                            label="Adicionar atualização"
                            variant="outlined"
                            fullWidth
                            value={novasAtualizacoes[chaveAcompanhamento] || ''}
                            onChange={(e) => handleAtualizacaoChange(ocorrencia.id, aluno.id, e.target.value)}
                            sx={{ marginBottom: 2 }}
                          />
                          <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                            <RadioGroup
                              row
                              value={tipoAcompanhamento[chaveAcompanhamento] || ''}
                              onChange={(e) => handleTipoAcompanhamentoChange(ocorrencia.id, aluno.id, e.target.value)}
                            >
                              <FormControlLabel value="acompanhamento" control={<Radio />} label="Acompanhamento" />
                              <FormControlLabel value="encaminhamento" control={<Radio />} label="Encaminhamento" />
                            </RadioGroup>
                          </FormControl>
                          {tipoAcompanhamento[chaveAcompanhamento] === 'acompanhamento' && (
                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                              <InputLabel id={`tipo-select-label-${chaveAcompanhamento}`}>Tipo de Acompanhamento</InputLabel>
                              <Select
                                labelId={`tipo-select-label-${chaveAcompanhamento}`}
                                value={tipoAtualizacao[chaveAcompanhamento] || ''}
                                label="Tipo de Acompanhamento"
                                onChange={(e) => handleTipoAtualizacaoChange(ocorrencia.id, aluno.id, e.target.value)}
                              >
                                <MenuItem value="agressão verbal">Agressão Verbal</MenuItem>
                                <MenuItem value="agressão física">Agressão Física</MenuItem>
                                <MenuItem value="agressão patrimonial">Agressão Patrimonial</MenuItem>
                                <MenuItem value="bullying">Bullying</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                          {tipoAcompanhamento[chaveAcompanhamento] === 'encaminhamento' && (
                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                              <InputLabel id={`encaminhamento-select-label-${chaveAcompanhamento}`}>Tipo de Encaminhamento</InputLabel>
                              <Select
                                labelId={`encaminhamento-select-label-${chaveAcompanhamento}`}
                                value={tipoAtualizacao[chaveAcompanhamento] || ''}
                                label="Tipo de Encaminhamento"
                                onChange={(e) => handleTipoAtualizacaoChange(ocorrencia.id, aluno.id, e.target.value)}
                              >
                                <MenuItem value="interno">Interno</MenuItem>
                                <MenuItem value="externo">Externo</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => adicionarAtualizacao(ocorrencia.id, aluno.id)}
                            disabled={
                              !novasAtualizacoes[chaveAcompanhamento]?.trim() ||
                              !tipoAcompanhamento[chaveAcompanhamento] ||
                              !tipoAtualizacao[chaveAcompanhamento]
                            }
                          >
                            Salvar Atualização
                          </Button>
                        </Box>
                      )}

                      {/* Lista de Atualizações em formato de tabela */}
                      {acompanhamentoAluno.atualizacoes && acompanhamentoAluno.atualizacoes.length > 0 && (
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                          <Table aria-label="atualizações">
                            <TableHead>
                              <TableRow>
                                <TableCell>Data/Hora</TableCell>
                                <TableCell>Texto da Atualização</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Tipo</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {acompanhamentoAluno.atualizacoes.map((atualizacao, index) => (
                                <TableRow key={index}>
                                  <TableCell>{new Date(atualizacao.dataHora).toLocaleString()}</TableCell>
                                  <TableCell>{atualizacao.texto}</TableCell>
                                  <TableCell>{atualizacao.categoria}</TableCell>
                                  <TableCell>{atualizacao.tipo}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default OcorrenciasPorAluno;
