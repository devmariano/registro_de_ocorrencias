import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function FormularioOcorrencia({ alunos, onCadastrarOcorrencia }) {
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCadastrarOcorrencia({ descricao, tipo, alunosEnvolvidos: alunosSelecionados });
    setDescricao('');
    setTipo('');
    setAlunosSelecionados([]);
  };

  return (
    <Box sx={{ marginTop: 4 }}>
    <Typography variant="h5" gutterBottom>
        Cadastro de Ocorrências
      </Typography>
      
    <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: "#fff",  marginBottom: 3, padding: 3, border: '1px solid #ccc', borderRadius: '8px' }}>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <TextField
          label="Descrição"
          multiline
          rows={2}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          input={<OutlinedInput label="Tipo" />}
          required
        >
          <MenuItem value="agressão verbal">Agressão Verbal</MenuItem>
          <MenuItem value="agressão física">Agressão Física</MenuItem>
          <MenuItem value="agressão patrimonial">Agressão Patrimonial</MenuItem>
          <MenuItem value="bullying">Bullying</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Alunos Envolvidos</InputLabel>
        <Select
          multiple
          value={alunosSelecionados}
          onChange={(e) => setAlunosSelecionados([...e.target.value])}
          input={<OutlinedInput label="Alunos Envolvidos" />}
          renderValue={(selected) => selected.map(id => alunos.find(a => a.id == id)?.nome).join(', ')}
        >
          {alunos.map(aluno => (
            <MenuItem key={aluno.id} value={aluno.id}>
              <Checkbox checked={alunosSelecionados.includes(aluno.id)} />
              <ListItemText primary={aluno.nome} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" startIcon={<AddCircleIcon />} variant="contained" color="primary">
      Cadastrar Ocorrência
</Button>
    </Box>
    </Box>
  );
}

export default FormularioOcorrencia;
