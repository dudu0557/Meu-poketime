// =========================================================
//  BACKEND - PROJETO FINAL: MEU POKÉTIME
//  Tecnologias: Node.js, Express, FileSystem (fs), JWT
// =========================================================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Gera IDs únicos
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'chave_secreta_projeto_final'; // Segredo para assinar o token

// --- 1. CONFIGURAÇÕES GERAIS ---
app.use(cors()); // Permite conexão do Frontend (porta 5173)
app.use(bodyParser.json());

// --- 2. FUNÇÕES AUXILIARES (Simulando Banco de Dados) ---

// Função genérica para ler arquivos JSON na pasta 'dados'
const lerBancoDeDados = (nomeArquivo) => {
    const caminho = path.join(__dirname, 'dados', nomeArquivo);
    try {
        const conteudo = fs.readFileSync(caminho, 'utf8');
        return JSON.parse(conteudo);
    } catch (error) {
        return []; // Retorna lista vazia se arquivo não existir
    }
};

// Função genérica para salvar dados no arquivo JSON
const salvarNoBancoDeDados = (nomeArquivo, dados) => {
    const caminho = path.join(__dirname, 'dados', nomeArquivo);
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
};

// --- 3. MIDDLEWARE DE SEGURANÇA (O Porteiro) ---
// Verifica se o usuário tem um Token válido antes de deixar acessar rotas privadas
const verificarToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) {
        return res.status(401).json({ message: 'Acesso negado: Token não fornecido.' });
    }

    const token = tokenHeader.split(' ')[1]; // Remove o prefixo "Bearer "

    jwt.verify(token, SECRET_KEY, (erro, decodificado) => {
        if (erro) {
            return res.status(403).json({ message: 'Acesso negado: Token inválido.' });
        }
        // Salva o ID do usuário na requisição para usar nas próximas rotas
        req.usuarioId = decodificado.id;
        next(); // Pode passar!
    });
};

// =========================================================
//  ROTAS PÚBLICAS (Login e Cadastro)
// =========================================================

// Rota de Cadastro
app.post('/cadastro', (req, res) => {
    const { usuario, email, senha, confirmacaoSenha } = req.body;
    const listaUsuarios = lerBancoDeDados('usuarios.json');

    // Validações básicas
    if (!usuario || !email || !senha) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }
    if (senha !== confirmacaoSenha) {
        return res.status(400).json({ message: 'As senhas não conferem.' });
    }
    
    // Verifica duplicidade
    const emailJaExiste = listaUsuarios.find(u => u.email === email);
    if (emailJaExiste) {
        return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // Cria e salva o novo usuário
    const novoUsuario = { id: uuidv4(), usuario, email, senha };
    listaUsuarios.push(novoUsuario);
    salvarNoBancoDeDados('usuarios.json', listaUsuarios);

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const listaUsuarios = lerBancoDeDados('usuarios.json');

    const usuarioEncontrado = listaUsuarios.find(u => u.email === email && u.senha === senha);

    if (!usuarioEncontrado) {
        return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Gera o Token JWT (O "Crachá" de acesso)
    const token = jwt.sign(
        { id: usuarioEncontrado.id, email: usuarioEncontrado.email },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ 
        message: 'Login realizado!', 
        token, 
        usuario: usuarioEncontrado.usuario 
    });
});

// =========================================================
//  ROTAS PRIVADAS (CRUD de Pokémons e Usuário)
//  Todas usam o middleware 'verificarToken'
// =========================================================

// [R] READ - Listar Pokémons do usuário logado
app.get('/pokemons', verificarToken, (req, res) => {
    const todosPokemons = lerBancoDeDados('time.json');
    // Filtra apenas os pokémons que pertencem a quem está logado
    const meusPokemons = todosPokemons.filter(p => p.usuarioId === req.usuarioId);
    res.json(meusPokemons);
});

// [C] CREATE - Adicionar novo Pokémon
app.post('/pokemons', verificarToken, (req, res) => {
    const { nome, apelido, imagem } = req.body;
    const todosPokemons = lerBancoDeDados('time.json');

    const novoPokemon = {
        id: uuidv4(),
        usuarioId: req.usuarioId, // Vincula ao usuário logado
        nome,
        apelido,
        imagem
    };

    todosPokemons.push(novoPokemon);
    salvarNoBancoDeDados('time.json', todosPokemons);
    res.status(201).json(novoPokemon);
});

// [U] UPDATE - Atualizar Apelido do Pokémon
app.put('/pokemons/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { apelido } = req.body;
    let todosPokemons = lerBancoDeDados('time.json');

    const index = todosPokemons.findIndex(p => p.id === id);

    // Verifica se o pokémon existe e se pertence ao usuário
    if (index >= 0 && todosPokemons[index].usuarioId === req.usuarioId) {
        todosPokemons[index].apelido = apelido;
        salvarNoBancoDeDados('time.json', todosPokemons);
        res.json({ message: 'Apelido atualizado com sucesso!' });
    } else {
        res.status(404).json({ message: 'Pokémon não encontrado ou sem permissão.' });
    }
});

// [D] DELETE - Remover Pokémon
app.delete('/pokemons/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    let todosPokemons = lerBancoDeDados('time.json');

    const listaAtualizada = todosPokemons.filter(p => p.id !== id);

    if (todosPokemons.length === listaAtualizada.length) {
        return res.status(404).json({ message: 'Pokémon não encontrado.' });
    }

    salvarNoBancoDeDados('time.json', listaAtualizada);
    res.json({ message: 'Pokémon removido do time.' });
});

// [EXTRA] UPDATE - Atualizar Nome do Usuário
app.put('/usuario', verificarToken, (req, res) => {
    const { novoNome } = req.body;
    let listaUsuarios = lerBancoDeDados('usuarios.json');

    const index = listaUsuarios.findIndex(u => u.id === req.usuarioId);

    if (index >= 0) {
        listaUsuarios[index].usuario = novoNome;
        salvarNoBancoDeDados('usuarios.json', listaUsuarios);
        res.json({ message: 'Nome de usuário atualizado!' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
});

// --- INICIALIZAÇÃO ---
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});