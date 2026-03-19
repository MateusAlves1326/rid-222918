import axios from "axios";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LivrosService } from "../../api/LivrosService";
import Header from "../../components/Header/Header";
import SubmenuLivros from "../../components/SubmenuLivros/SubmenuLivros";
import type { LivroPayload } from "../../types/livro";
import "./index.scss";

const LivrosCadastro = () => {
  const navigate = useNavigate();
  const [livro, setLivro] = useState<LivroPayload>({
    titulo: "",
    numero_paginas: 0,
    isbn: "",
    editora: ""
  });
  const [erro, setErro] = useState<string>("");
  const [salvando, setSalvando] = useState<boolean>(false);

  function getMensagemErro(error: unknown) {
    if (axios.isAxiosError<{ mensagem?: string }>(error)) {
      return error.response?.data?.mensagem || "Erro ao conectar com a API.";
    }

    return "Erro inesperado.";
  }

  async function createLivro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro("");

      await LivrosService.createLivro({
        ...livro,
        numero_paginas: Number(livro.numero_paginas)
      });

      navigate("/livros");
    } catch (error) {
      setErro(getMensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
  <>
    <Header/>    
    <SubmenuLivros/>
    <div className='livrosCadastro'>
        <h1>Cadastro de Livros</h1>
        {erro && <p className='mensagem erro'>{erro}</p>}
        <div>          
          <form id="formulario" onSubmit={createLivro}>
          <div className='form-group'>
            <label>Titulo</label>
            <input type="text" id='titulo' required onChange={(event)=>{ setLivro({...livro, titulo: event.target.value})}} value={livro.titulo}></input>
          </div>
          <div className='form-group'>
            <label>Número de Páginas</label>
            <input type="number" id='num' min={1} required onChange={(event)=>{ setLivro({...livro, numero_paginas: Number(event.target.value)})}} value={livro.numero_paginas || ""}></input>
          </div>
          <div className='form-group'>
            <label>ISBN</label>
            <input type="text" id='isbn' required onChange={(event)=>{ setLivro({...livro, isbn: event.target.value})}} value={livro.isbn}></input>
          </div>
          <div className='form-group'>
            <label>Editora</label>
            <input type="text" id='editora' required onChange={(event)=>{ setLivro({...livro, editora: event.target.value})}} value={livro.editora}></input>
          </div> 
          <div className='form-group'>
            <button type='submit' disabled={salvando}>{salvando ? "Salvando..." : "Cadastrar Livro"}</button>  
          </div>         
          </form>
        </div>
    </div>
  </>)
  
}

export default LivrosCadastro