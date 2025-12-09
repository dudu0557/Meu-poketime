# 🏆 Meu PokéTime - Gerenciador de Times Pokémon

> Projeto Final desenvolvido para a disciplina de Programação Web (XDES03).

## 📝 Sobre o Projeto
Este é um sistema **Fullstack** desenvolvido como avaliação final. O objetivo do projeto é permitir que treinadores criem uma conta, façam login e gerenciem seu próprio time de Pokémons.

A aplicação consome dados reais da **PokéAPI** (API externa) e salva as informações dos usuários e seus times em arquivos locais (JSON), simulando um banco de dados, conforme solicitado nos requisitos do trabalho.

## 🛠️ Tecnologias Utilizadas

### Frontend (Interface)
* **React (Vite):** Framework principal.
* **React Router Dom:** Para navegação entre telas (SPA) sem recarregar a página.
* **Axios:** Para fazer as requisições HTTP (conectar com o backend e com a API externa).
* **CSS3:** Estilização com Grid Layout responsivo e tema escuro.

### Backend (API)
* **Node.js & Express:** Para criar o servidor e as rotas da API.
* **File System (fs):** Para persistência de dados em arquivos `.json` (substituindo banco de dados SQL).
* **JWT (JSON Web Token):** Para autenticação segura e proteção de rotas.
* **CORS:** Para permitir a comunicação entre o frontend e o backend.

## ✨ Funcionalidades

* [x] **Cadastro e Login:** Criação de conta com validação de senha e e-mail único.
* [x] **Autenticação:** Uso de Token JWT para garantir que apenas usuários logados acessem o sistema.
* [x] **API Externa:** Busca de Pokémons em tempo real direto da PokéAPI.
* [x] **CRUD Completo:**
    * Adicionar Pokémon ao time.
    * Visualizar lista de capturados.
    * Editar apelido do Pokémon.
    * Editar nome do treinador.
    * Excluir Pokémon do time.
* [x] **Layout Dinâmico:** A grade se ajusta automaticamente (2 ou 3 colunas) dependendo da quantidade de Pokémons.

---

## 🚀 Como Rodar o Projeto

Pré-requisitos: Ter o **Node.js** e o **Git** instalados na máquina.

### 1. Clonar o repositório
Abra o terminal e rode:
```bash
git clone [https://github.com/dudu0557/Meu-poketime.git](https://github.com/dudu0557/Meu-poketime.git)
cd Meu-poketime

cd backend
npm install
node server.js

cd frontend
npm install
npm run dev
![Uploading image.png…]()
