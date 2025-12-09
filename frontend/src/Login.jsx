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
      <h2>Acesse seu Time</h2>
      <br/>
      <form onSubmit={formik.handleSubmit}>
        <input 
          type="email" 
          placeholder="E-mail"
          {...formik.getFieldProps('email')} 
        />
        <input 
          type="password" 
          placeholder="Senha"
          {...formik.getFieldProps('senha')} 
        />
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
      <br/>
      <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </div>
  );
};

export default Login;