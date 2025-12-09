const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'minha_chave_secreta_super_segura'; // Usado para assinar o token

// Configurações
app.use(cors());
app.use(bodyParser.json());

// --- FUNÇÕES AUXILIARES (Para ler e escrever nos arquivos) ---

// Função para ler dados do arquivo JSON
const lerDados = (arquivo) => {
    const caminho = path.join(__dirname, 'dados', arquivo);
    try {
        const dados = fs.readFileSync(caminho, 'utf8');
        return JSON.parse(dados);
    } catch (error) {
        return []; // Se der erro ou arquivo não existir, retorna lista vazia
    }
};

// Função para salvar dados no arquivo JSON
const salvarDados = (arquivo, dados) => {
    const caminho = path.join(__dirname, 'dados', arquivo);
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
};

// --- ROTAS PÚBLICAS (Qualquer um acessa) ---

// Rota de Teste
app.get('/', (req, res) => {
    res.send('Servidor do Projeto Final está rodando!');
});

// Rota de Cadastro de Usuário
app.post('/cadastro', (req, res) => {
    const { usuario, email, senha, confirmacaoSenha } = req.body;
    const usuarios = lerDados('usuarios.json');

    // Validações Básicas
    if (!usuario || !email || !senha || !confirmacaoSenha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (senha !== confirmacaoSenha) {
        return res.status(400).json({ message: 'Senhas não conferem.' });
    }
    if (senha.length < 4) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 4 dígitos.' });
    }
    // Verifica se e-mail já existe
    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    // Salva o usuário
    const novoUsuario = { id: uuidv4(), usuario, email, senha }; 
    usuarios.push(novoUsuario);
    salvarDados('usuarios.json', usuarios);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuarios = lerDados('usuarios.json');

    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuarioEncontrado) {
        return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    // Gera o Token
    const token = jwt.sign({ id: usuarioEncontrado.id, email: usuarioEncontrado.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login realizado!', token, usuario: usuarioEncontrado.usuario });
});

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const autenticar = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) return res.status(401).json({ message: 'Token não fornecido.' });

    const token = tokenHeader.split(' ')[1]; // Remove o "Bearer " do início

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.usuarioId = decoded.id;
        next();
    });
};

// --- ROTAS PRIVADAS (CRUD do Time Pokémon) ---

// LISTAR (Read)
app.get('/pokemons', autenticar, (req, res) => {
    const time = lerDados('time.json');
    const meusPokemons = time.filter(p => p.usuarioId === req.usuarioId);
    res.json(meusPokemons);
});

// ADICIONAR (Create)
app.post('/pokemons', autenticar, (req, res) => {
    const { nome, apelido, imagem } = req.body;
    const time = lerDados('time.json');

    const novoPokemon = {
        id: uuidv4(),
        usuarioId: req.usuarioId,
        nome,
        apelido,
        imagem
    };

    time.push(novoPokemon);
    salvarDados('time.json', time);
    res.status(201).json(novoPokemon);
});

// REMOVER (Delete)
app.delete('/pokemons/:id', autenticar, (req, res) => {
    const { id } = req.params;
    let time = lerDados('time.json');

    const timeAtualizado = time.filter(p => p.id !== id);

    if (time.length === timeAtualizado.length) {
        return res.status(404).json({ message: 'Pokémon não encontrado.' });
    }

    salvarDados('time.json', timeAtualizado);
    res.json({ message: 'Pokémon removido do time.' });
});

// ATUALIZAR POKEMON (Update)
app.put('/pokemons/:id', autenticar, (req, res) => {
    const { id } = req.params;
    const { apelido } = req.body;
    let time = lerDados('time.json');
    
    const index = time.findIndex(p => p.id === id);
    
    if (index >= 0 && time[index].usuarioId === req.usuarioId) {
        time[index].apelido = apelido;
        salvarDados('time.json', time);
        res.json({ message: 'Apelido atualizado!' });
    } else {
        res.status(404).json({ message: 'Erro ao atualizar.' });
    }
});

// ATUALIZAR NOME DO USUÁRIO (Extra) - AGORA NO LUGAR CERTO!
app.put('/usuario', autenticar, (req, res) => {
    const { novoNome } = req.body;
    let usuarios = lerDados('usuarios.json');
    
    const index = usuarios.findIndex(u => u.id === req.usuarioId);
    
    if (index >= 0) {
        usuarios[index].usuario = novoNome;
        salvarDados('usuarios.json', usuarios);
        res.json({ message: 'Nome atualizado com sucesso!' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});