# 🔴 Meu PokéTime - Projeto Final de Web

Olá! 👋 Esse é o repositório do **meu** trabalho final da disciplina de **Programação Web (XDES03)**.

Desenvolvi este projeto sozinho para criar um site completo (Fullstack) onde fosse possível criar uma conta e montar um time de Pokémons, salvando tudo direitinho. Tentei aplicar aqui tudo o que aprendi em aula sobre React e Node.js.

## 💡 O que o projeto faz?

Basicamente, é um gerenciador de times que eu criei.
* Você cria sua conta (tem que colocar senha e tudo).
* Faz o login (implementei Token para ficar seguro).
* Pesquisa um Pokémon (o sistema busca lá na API oficial da Nintendo/PokeAPI).
* Clica em "Capturar" e ele salva no seu time.
* Se o time ficar cheio (6 ou mais), fiz a tela se ajeitar sozinha para caber tudo.

## 🛠️ O que eu usei para fazer

Utilizei as ferramentas que estudei durante o semestre:

* **Frontend (A tela):** Fiz com **React** e **Vite**. Usei também o **Axios** para conectar com a internet e o **React Router** para trocar de tela sem recarregar (SPA).
* **Backend (O servidor):** Construí com **Node.js** e **Express**.
* **Banco de Dados:** Como o professor pediu para não usar banco SQL complexo agora, optei por salvar os dados em arquivos `.json` usando o **File System (fs)** do Node.
* **Estilos:** Criei um CSS com tema escuro (Dark Mode) e usei Grid para organizar os cards.

## 🚀 Como testar no seu computador

Se você quiser rodar meu projeto, segue o passo a passo que preparei:

1. **Baixe o projeto:**
   Primeiro, clona o repositório ou baixa o ZIP.
   ```bash
   git clone [https://github.com/dudu0557/Meu-poketime.git](https://github.com/dudu0557/Meu-poketime.git)
   Ligue o Backend (Servidor): Abra a pasta backend no terminal.

Instale as dependências:
npm install
Rode o servidor:
node server.js

Importante: Crie uma pastinha chamada dados dentro da pasta backend (o git não enviou ela vazia).

Ligue o Frontend (Site): Abra outro terminal na pasta frontend.

Instale as coisas do React: 
npm install
Rode o site: 
npm run dev

Aí é só abrir o link que aparecer (geralmente http://localhost:5173).

![WhatsApp Image 2025-12-09 at 18 16 31](https://github.com/user-attachments/assets/25827624-7360-4980-97b2-83d048fddb65)
![WhatsApp Image 2025-12-09 at 18 15 58](https://github.com/user-attachments/assets/76bda759-543a-458a-b28a-4da40a79772d)
![WhatsApp Image 2025-12-09 at 18 15 23](https://github.com/user-attachments/assets/2cb5bc14-63b1-40a2-9e44-a0e42a613280)

MArcus Eduardo Ribeiro
https://github.com/dudu0557/Meu-poketime/tree/main

