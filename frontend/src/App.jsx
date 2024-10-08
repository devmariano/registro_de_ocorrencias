import { useState, useEffect } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, Grid } from '@mui/material';
import FormularioOcorrencia from './components/FormularioOcorrencia';
//import ListaOcorrencias from './components/ListaOcorrencias';
import ListaResumoOcorrencias from './components/ListaResumoOcorrencias';
import OcorrenciasPorAluno from './components/OcorrenciasPorAluno'; // Importa o componente OcorrenciasPorAluno
import ListaAcompanhamentoAlunos from './components/ListaAcompanhamentoAlunos'; // Novo componente importado
import theme from './theme'; // Importa o tema personalizado

function App() {
  const [alunos, setAlunos] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [key, setKey] = useState(0); // Estado para armazenar a key que controla o re-render

  // Função para recarregar o componente OcorrenciasPorAluno
  const refreshComponent = () => {
    setKey(prevKey => prevKey + 1); // Incrementa a key para forçar o re-render
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/alunos')
      .then(response => response.json())
      .then(data => setAlunos(data));

    fetch('http://localhost:3000/api/ocorrencias')
      .then(response => response.json())
      .then(data => setOcorrencias(data));
  }, [key]); // Recarrega os dados toda vez que a key mudar

  const cadastrarOcorrencia = (novaOcorrencia) => {
    fetch('http://localhost:3000/api/ocorrencias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaOcorrencia),
    })
    .then(response => response.json())
    .then(data => {
      setOcorrencias([...ocorrencias, data]);
      refreshComponent(); // Atualiza o componente OcorrenciasPorAluno
    });
  };

  const alterarStatusAcompanhamento = (ocorrenciaId, alunoId, novoStatus) => {
    fetch(`http://localhost:3000/api/ocorrencias/${ocorrenciaId}/acompanhamento/${alunoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: novoStatus }),
    })
    .then(() => {
      // Atualizar lista de ocorrências
      fetch('http://localhost:3000/api/ocorrencias')
        .then(response => response.json())
        .then(data => {
          setOcorrencias(data);
          refreshComponent(); // Atualiza o componente OcorrenciasPorAluno
        });
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ marginTop: 1 }}>
        <Typography variant="h3" gutterBottom align="center">
          Exemplo Simplificado do Cadastro de Ocorrências
        </Typography>
        <Grid container spacing={4}>
          {/* Formulário de Cadastro */}
          <Grid item xs={12} md={6}>
            <FormularioOcorrencia alunos={alunos} onCadastrarOcorrencia={cadastrarOcorrencia} />
            {/* Resumo das Ocorrências */}
            <ListaResumoOcorrencias alunos={alunos} ocorrencias={ocorrencias} />
            {/* Lista de Acompanhamento de Alunos com Ocorrências em Andamento */}
            <ListaAcompanhamentoAlunos alunos={alunos} ocorrencias={ocorrencias} />
          </Grid>
          {/* Lista de Ocorrências */}
          {/* <Grid item xs={12} md={6}>
            <ListaOcorrencias ocorrencias={ocorrencias} alunos={alunos} onAlterarStatus={alterarStatusAcompanhamento} /> */}
          {/* Ocorrências por Aluno */}
          <Grid item xs={12} md={6}>
            <OcorrenciasPorAluno 
              key={key} // Passa a key para forçar o re-render quando `key` mudar
              alunos={alunos} 
              ocorrencias={ocorrencias} 
              onAlterarStatus={alterarStatusAcompanhamento} 
              refreshComponent={refreshComponent} // Passa a função para recarregar o componente
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}



export default App;
