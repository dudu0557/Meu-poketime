import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', senha: '' },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:3000/login', values);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', response.data.usuario);
        navigate('/dashboard');
      } catch (error) {
        alert('E-mail ou senha incorretos');
      }
    },
  });

  return (
    <div className="auth-container">
      {/* IMAGEM DO LOGO */}
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" 
        alt="Logo Pokémon" 
        className="login-logo"
      />
      
      {/* TÍTULO ESTILIZADO */}
      <h2 className="auth-title">Acesse seu Time</h2>
      
      <form onSubmit={formik.handleSubmit}>
        <input 
          type="email" 
          placeholder="E-mail de Treinador"
          {...formik.getFieldProps('email')} 
        />
        <input 
          type="password" 
          placeholder="Senha Secreta"
          {...formik.getFieldProps('senha')} 
        />
        <button type="submit" className="btn-primary">Entrar na Aventura</button>
      </form>
      
      <br/>
      <p>Novo por aqui? <Link to="/cadastro" style={{fontWeight: 'bold'}}>Criar Pokedéx</Link></p>
    </div>
  );
};

export default Login;