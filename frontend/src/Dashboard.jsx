import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [meuTime, setMeuTime] = useState([]);
  const [erro, setErro] = useState('');
  
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuario') || 'Treinador');
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => { carregarTime(); }, []);

  const carregarTime = async () => {
    try {
      const response = await api.get('/pokemons');
      setMeuTime(response.data);
    } catch (error) { navigate('/'); }
  };

  const editarNomeUsuario = async () => {
    const novoNome = prompt("Como você quer ser chamado?", nomeUsuario);
    if (novoNome && novoNome !== nomeUsuario) {
      try {
        await api.put('/usuario', { novoNome });
        localStorage.setItem('usuario', novoNome);
        setNomeUsuario(novoNome);
        alert('Nome de treinador atualizado!');
      } catch (error) { alert('Erro ao atualizar nome.'); }
    }
  };

  const buscarPokemon = async (e) => {
    e.preventDefault();
    setErro('');
    setResultadoBusca(null);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${busca.toLowerCase()}`);
      setResultadoBusca({
        nome: response.data.name,
        imagem: response.data.sprites.front_default,
        tipo: response.data.types[0].type.name
      });
    } catch (error) { setErro('Pokémon não encontrado!'); }
  };

  const adicionarAoTime = async () => {
    if (!resultadoBusca) return;
    try {
      await api.post('/pokemons', {
        nome: resultadoBusca.nome,
        imagem: resultadoBusca.imagem,
        apelido: resultadoBusca.nome
      });
      alert(`${resultadoBusca.nome} capturado!`);
      setResultadoBusca(null);
      setBusca('');
      carregarTime();
    } catch (error) { alert('Erro ao salvar.'); }
  };

  const removerDoTime = async (id) => {
    if (window.confirm('Tem certeza?')) {
      await api.delete(`/pokemons/${id}`);
      carregarTime();
    }
  };

  const editarApelidoPokemon = async (id, apelidoAtual) => {
    const novoApelido = prompt("Novo apelido para o Pokémon:", apelidoAtual);
    if (novoApelido && novoApelido !== apelidoAtual) {
      try {
        await api.put(`/pokemons/${id}`, { apelido: novoApelido });
        carregarTime();
      } catch (error) { alert('Erro ao atualizar apelido.'); }
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Lógica para definir as colunas: 6 ou mais pokemons = 3 colunas, menos que 6 = 2 colunas
  const colunasGrid = meuTime.length >= 6 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

  return (
    <div className="dashboard-container">
      <header className="header">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <h1>Olá, {nomeUsuario}!</h1>
          <button onClick={editarNomeUsuario} className="btn-edit" title="Mudar meu nome">✏️</button>
        </div>
        <button onClick={logout} className="btn-delete" style={{width: 'auto'}}>Sair</button>
      </header>

      <div className="search-box">
        <h3>🔍 Buscar Novos Pokémons</h3>
        <br/>
        <form onSubmit={buscarPokemon} className="search-form">
          <input 
            type="text" 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)} 
            placeholder="Nome do Pokémon (ex: charizard)" 
          />
          <button type="submit" className="btn-primary" style={{width: '100px', marginTop: '8px'}}>Buscar</button>
        </form>
        {erro && <p style={{ color: 'var(--danger)', marginTop: '10px' }}>{erro}</p>}

        {resultadoBusca && (
          <div className="pokemon-result">
            <img src={resultadoBusca.imagem} alt={resultadoBusca.nome} />
            <p><strong>{resultadoBusca.nome.toUpperCase()}</strong> ({resultadoBusca.tipo})</p>
            <button onClick={adicionarAoTime} className="btn-add">Capturar Pokémon</button>
          </div>
        )}
      </div>

      <h3 style={{marginBottom: '20px'}}>🏆 Meu Time ({meuTime.length})</h3>
      
      {meuTime.length === 0 ? <p>Seu time está vazio.</p> : (
        <div className="pokemon-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: colunasGrid, 
          gap: '20px', 
          width: '100%' 
        }}>
          {meuTime.map((poke) => (
            <div key={poke.id} className="pokemon-card">
              <img src={poke.imagem} alt={poke.nome} />
              <h4>{poke.apelido}</h4>
              <div className="card-actions">
                <button onClick={() => editarApelidoPokemon(poke.id, poke.apelido)} className="btn-edit">✏️</button>
                <button onClick={() => removerDoTime(poke.id)} className="btn-delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;