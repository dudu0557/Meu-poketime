import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // --- 1. ESTADOS (Memória do Componente) ---
  const [termoBusca, setTermoBusca] = useState('');
  const [pokemonEncontrado, setPokemonEncontrado] = useState(null);
  const [meuTime, setMeuTime] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');
  
  // Estado inicial do nome do usuário (lê do localStorage ou usa padrão)
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('usuario') || 'Treinador');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- 2. CONFIGURAÇÃO DA API (Axios) ---
  // Cria uma instância que já envia o Token em todas as requisições
  const apiInterna = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- 3. EFEITOS (Ciclo de Vida) ---
  // Carrega o time assim que a tela abre
  useEffect(() => {
    carregarMeuTime();
  }, []);

  // --- 4. FUNÇÕES DE LÓGICA ---

  // Busca a lista de pokémons do servidor (Backend)
  const carregarMeuTime = async () => {
    try {
      const response = await apiInterna.get('/pokemons');
      setMeuTime(response.data);
    } catch (error) {
      // Se der erro (ex: token expirado), volta para o login
      navigate('/');
    }
  };

  // Função Extra: Atualizar o nome do Treinador
  const atualizarNomeTreinador = async () => {
    const novoNome = prompt("Como você quer ser chamado?", nomeUsuario);
    if (novoNome && novoNome !== nomeUsuario) {
      try {
        await apiInterna.put('/usuario', { novoNome });
        localStorage.setItem('usuario', novoNome);
        setNomeUsuario(novoNome);
        alert('Nome atualizado com sucesso!');
      } catch (error) {
        alert('Erro ao atualizar nome.');
      }
    }
  };

  // Busca na API Externa (PokeAPI)
  const buscarNaPokeApi = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setPokemonEncontrado(null);

    if (!termoBusca) return;

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${termoBusca.toLowerCase()}`);
      
      // Filtra apenas os dados que nos interessam
      setPokemonEncontrado({
        nome: response.data.name,
        imagem: response.data.sprites.front_default,
        tipo: response.data.types[0].type.name
      });
    } catch (error) {
      setMensagemErro('Pokémon não encontrado! Verifique o nome.');
    }
  };

  // Salva o pokémon encontrado no nosso Backend
  const capturarPokemon = async () => {
    if (!pokemonEncontrado) return;
    try {
      await apiInterna.post('/pokemons', {
        nome: pokemonEncontrado.nome,
        imagem: pokemonEncontrado.imagem,
        apelido: pokemonEncontrado.nome // Apelido começa igual ao nome
      });
      
      alert(`${pokemonEncontrado.nome} foi capturado!`);
      setPokemonEncontrado(null);
      setTermoBusca('');
      carregarMeuTime(); // Atualiza a lista na tela
    } catch (error) {
      alert('Erro ao salvar no banco de dados.');
    }
  };

  // Remove um pokémon do time
  const soltarPokemon = async (id) => {
    if (window.confirm('Tem certeza que deseja soltar este Pokémon?')) {
      await apiInterna.delete(`/pokemons/${id}`);
      carregarMeuTime();
    }
  };

  // Edita o apelido de um pokémon
  const editarApelido = async (id, apelidoAtual) => {
    const novoApelido = prompt("Novo apelido:", apelidoAtual);
    if (novoApelido && novoApelido !== apelidoAtual) {
      try {
        await apiInterna.put(`/pokemons/${id}`, { apelido: novoApelido });
        carregarMeuTime();
      } catch (error) {
        alert('Erro ao editar apelido.');
      }
    }
  };

  // --- 5. LÓGICA VISUAL (Grid Dinâmico) ---
  // Se tiver 6 ou mais pokémons: 3 colunas. Senão: 2 colunas.
  const estiloGrid = {
    display: 'grid',
    gridTemplateColumns: meuTime.length >= 6 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
    gap: '20px',
    width: '100%'
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // --- 6. RENDERIZAÇÃO (HTML) ---
  return (
    <div className="dashboard-container">
      
      {/* Cabeçalho */}
      <header className="header">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <h1>Olá, {nomeUsuario}!</h1>
          <button onClick={atualizarNomeTreinador} className="btn-edit" title="Editar nome">✏️</button>
        </div>
        <button onClick={logout} className="btn-delete" style={{width: 'auto'}}>Sair</button>
      </header>

      {/* Área de Busca */}
      <div className="search-box">
        <h3>🔍 Buscar Novos Pokémons</h3>
        <br/>
        <form onSubmit={buscarNaPokeApi} className="search-form">
          <input 
            type="text" 
            value={termoBusca} 
            onChange={(e) => setTermoBusca(e.target.value)} 
            placeholder="Nome do Pokémon (ex: charizard)" 
          />
          <button type="submit" className="btn-primary" style={{width: '100px', marginTop: '8px'}}>Buscar</button>
        </form>
        
        {mensagemErro && <p style={{ color: 'var(--danger)', marginTop: '10px' }}>{mensagemErro}</p>}

        {/* Card de Resultado da Busca */}
        {pokemonEncontrado && (
          <div className="pokemon-result">
            <img src={pokemonEncontrado.imagem} alt={pokemonEncontrado.nome} />
            <p><strong>{pokemonEncontrado.nome.toUpperCase()}</strong> ({pokemonEncontrado.tipo})</p>
            <button onClick={capturarPokemon} className="btn-add">Capturar Pokémon</button>
          </div>
        )}
      </div>

      {/* Lista do Time (Grid) */}
      <h3 style={{marginBottom: '20px'}}>🏆 Meu Time ({meuTime.length})</h3>
      
      {meuTime.length === 0 ? <p>Seu time está vazio. Capture alguns Pokémons!</p> : (
        <div className="pokemon-grid" style={estiloGrid}>
          {meuTime.map((poke) => (
            <div key={poke.id} className="pokemon-card">
              <img src={poke.imagem} alt={poke.nome} />
              <h4>{poke.apelido}</h4>
              <div className="card-actions">
                <button onClick={() => editarApelido(poke.id, poke.apelido)} className="btn-edit">✏️</button>
                <button onClick={() => soltarPokemon(poke.id)} className="btn-delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;