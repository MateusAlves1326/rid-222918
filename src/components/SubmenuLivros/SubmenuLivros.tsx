import { Link } from 'react-router-dom';
import "./index.scss";

function SubmenuLivros() {
  return (
    <div className='submenu'>        
        <ul>
            <li><Link to="/livros">Listar Livros</Link></li>
            <li><Link to="/livros/cadastro">Cadastrar Livro</Link></li>
        </ul>        
    </div>
  )
}

export default SubmenuLivros
