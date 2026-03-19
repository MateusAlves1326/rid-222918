import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './global.scss';
import Home from './views/Home/Home';
import Livros from './views/Livros/Livros';
import LivrosCadastro from './views/LivrosCadastro/LivrosCadastro';
import LivrosEdicao from './views/LivrosEdicao/LivrosEdicao';
import LivroDetalhe from './views/LivroDetalhe/LivroDetalhe';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/livros",
    element: <Livros/>,
  },
  {
    path: "/livros/:livroId",
    element: <LivroDetalhe />,
  },
  {
    path: "/livros/cadastro",
    element: <LivrosCadastro />,
  },
  {
    path: "/livros/edicao/:livroId",
    element: <LivrosEdicao />,
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento root nao encontrado.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
