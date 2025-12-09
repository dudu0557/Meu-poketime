import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Cadastro = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { usuario: '', email: '', senha: '', confirmacaoSenha: '' },
    validationSchema: Yup.object({
      usuario: Yup.string().required('Obrigatório'),
      email: Yup.string().email('E-mail inválido').required('Obrigatório'),
      senha: Yup.string().min(4, 'Mínimo 4 caracteres').required('Obrigatório'),
      confirmacaoSenha: Yup.string().oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais').required('Obrigatório'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3000/cadastro', values);
        alert('Cadastro realizado com sucesso!');
        navigate('/');
      } catch (error) {
        alert(error.response?.data?.message || 'Erro ao cadastrar');
      }
    },
  });

  return (
    <div className="auth-container">
      {/* TÍTULO ESTILIZADO IGUAL AO LOGIN */}
      <h2 className="auth-title">Torne-se um Mestre</h2>
      <br/>
      <form onSubmit={formik.handleSubmit}>
        <input type="text" placeholder="Nome de Treinador" {...formik.getFieldProps('usuario')} />
        {formik.touched.usuario && formik.errors.usuario ? <small style={{color:'var(--danger)'}}>{formik.errors.usuario}</small> : null}

        <input type="email" placeholder="E-mail" {...formik.getFieldProps('email')} />
        {formik.touched.email && formik.errors.email ? <small style={{color:'var(--danger)'}}>{formik.errors.email}</small> : null}

        <input type="password" placeholder="Senha" {...formik.getFieldProps('senha')} />
        {formik.touched.senha && formik.errors.senha ? <small style={{color:'var(--danger)'}}>{formik.errors.senha}</small> : null}

        <input type="password" placeholder="Confirmar Senha" {...formik.getFieldProps('confirmacaoSenha')} />
        {formik.touched.confirmacaoSenha && formik.errors.confirmacaoSenha ? <small style={{color:'var(--danger)'}}>{formik.errors.confirmacaoSenha}</small> : null}

        <button type="submit" className="btn-primary">Iniciar Jornada</button>
      </form>
      <br/>
      <p>Já é um mestre? <Link to="/" style={{fontWeight: 'bold'}}>Fazer Login</Link></p>
    </div>
  );
};

export default Cadastro;