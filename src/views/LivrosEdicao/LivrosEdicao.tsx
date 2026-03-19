import axios from "axios";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LivrosService } from "../../api/LivrosService";
import Header from "../../components/Header/Header";
import SubmenuLivros from "../../components/SubmenuLivros/SubmenuLivros";
import type { Livro, LivroPayload } from "../../types/livro";
import "./index.scss";

const LivrosEdicao = () => {
  const { livroId } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
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

  async function editLivro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!livro) {
      return;
    }

    const body: LivroPayload = {
      titulo: livro.titulo,
      numero_paginas: Number(livro.numero_paginas),
      isbn: livro.isbn,
      editora: livro.editora
    };

    try {
      setSalvando(true);
      setErro("");
      await LivrosService.updateLivro(livro.id, body);
      navigate("/livros");
    } catch (error) {
      setErro(getMensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  function updateField<K extends keyof Livro>(key: K, value: Livro[K]) {
    if (!livro) {
      return;
    }

    setLivro({ ...livro, [key]: value });
  }

  useEffect(() => {
    getLivro();
  }, []);

  return (
    <>
      <Header />
      <SubmenuLivros />
      <div className='livrosCadastro'>
        <h1>Edicao de Livros</h1>
        {loading && <p className='mensagem'>Carregando livro...</p>}
        {!loading && erro && <p className='mensagem erro'>{erro}</p>}
        {!loading && livro && (
          <div>
            <form id='formulario' onSubmit={editLivro}>
              <div className='form-group'>
                <label>Id</label>
                <input type='text' disabled required value={livro.id}></input>
              </div>
              <div className='form-group'>
                <label>Titulo</label>
                <input type='text' required onChange={(event) => updateField("titulo", event.target.value)} value={livro.titulo}></input>
              </div>
              <div className='form-group'>
                <label>Numero de Paginas</label>
                <input type='number' min={1} required onChange={(event) => updateField("numero_paginas", Number(event.target.value))} value={livro.numero_paginas}></input>
              </div>
              <div className='form-group'>
                <label>ISBN</label>
                <input type='text' required onChange={(event) => updateField("isbn", event.target.value)} value={livro.isbn}></input>
              </div>
              <div className='form-group'>
                <label>Editora</label>
                <input type='text' required onChange={(event) => updateField("editora", event.target.value)} value={livro.editora}></input>
              </div>
              <div className='form-group'>
                <button type='submit' disabled={salvando}>{salvando ? "Salvando..." : "Atualizar Livro"}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default LivrosEdicao;
