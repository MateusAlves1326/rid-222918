import Header from "../../components/Header/Header";
import "./index.scss";

const Home = () => {
  return (
    <div className='home'>      
      <Header/>
      <h1>Biblioteca Central Online - Livros</h1>
      <p>Gerencie livros com cadastro, edicao, detalhes e exclusao.</p>
    </div>
  )
}

export default Home