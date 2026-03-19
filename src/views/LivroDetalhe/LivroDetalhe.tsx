import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LivrosService } from "../../api/LivrosService";
import Header from "../../components/Header/Header";
import SubmenuLivros from "../../components/SubmenuLivros/SubmenuLivros";
import type { Livro } from "../../types/livro";
import "./index.scss";

const LivroDetalhe = () => {
  const { livroId } = useParams();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");

  function getMensagemErro(error: unknown) {
    if (axios.isAxiosError<{ mensagem?: string }>(error)) {
      return error.response?.data?.mensagem || "Erro ao conectar com a API.";
    }

    return "Erro inesperado.";
  }

  async function getLivro() {
    const id = Number(livroId);

    if (!id) {
      setErro("ID invalido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErro("");
      const { data } = await LivrosService.getLivro(id);
      setLivro(data);
    } catch (error) {
      setErro(getMensagemErro(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLivro();
  }, []);

  return (
    <>
      <Header />
      <SubmenuLivros />
      <section className='livroDetalhe'>
        <h1>Detalhes do Livro</h1>
        {loading && <p className='mensagem'>Carregando livro...</p>}
        {!loading && erro && <p className='mensagem erro'>{erro}</p>}

        {!loading && !erro && livro && (
          <article className='card'>
            <h2>{livro.titulo}</h2>
            <p><strong>ID:</strong> {livro.id}</p>
            <p><strong>Numero de paginas:</strong> {livro.numero_paginas}</p>
            <p><strong>ISBN:</strong> {livro.isbn}</p>
            <p><strong>Editora:</strong> {livro.editora}</p>
            <div className='acoes'>
              <Link to={`/livros/edicao/${livro.id}`}>Editar</Link>
              <Link to='/livros'>Voltar</Link>
            </div>
          </article>
        )}
      </section>
    </>
  );
};

export default LivroDetalhe;
