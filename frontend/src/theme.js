import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',  // Define o modo claro
    primary: {
      main: '#1976d2', // Cor principal - azul, que se destaca bem no fundo claro
    },
    secondary: {
      main: '#dc004e', // Cor secundária - rosa, para dar um contraste interessante
    },
    background: {
      default: '#f5f5f5', // Fundo claro padrão
      paper: '#ffffff',   // Fundo dos Cards em branco
    },
    text: {
      primary: '#000000', // Texto principal em preto para um bom contraste
      secondary: '#4f4f4f', // Texto secundário em cinza
    },
  },
});

// const theme = createTheme({
//   palette: {
//     mode: 'dark',  // Define o modo escuro
//     primary: {
//       main: '#90caf9', // Cor principal, clara o suficiente para o modo escuro
//     },
//     secondary: {
//       main: '#f48fb1', // Cor secundária para botões ou detalhes
//     },
//     background: {
//       default: '#121212', // Fundo escuro padrão
//       paper: '#1e1e1e',   // Fundo dos Cards
//     },
//     text: {
//       primary: '#ffffff', // Texto principal em branco
//       secondary: '#b0bec5', // Texto secundário em cinza claro
//     },
//   },
// });

export default theme;
