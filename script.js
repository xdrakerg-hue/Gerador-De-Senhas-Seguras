// Lista de palavras em português para senhas memoráveis
const wordList = [
    'amor', 'azul', 'bola', 'cafe', 'casa', 'copo', 'dedo', 'fogo',
    'gato', 'ilha', 'java', 'kiwi', 'lado', 'mapa', 'nado', 'olho',
    'pato', 'raio', 'sapo', 'taco', 'uvas', 'vela', 'zero', 'atum',
    'bico', 'cela', 'dado', 'ebano', 'fada', 'gelo', 'heroi', 'iglu',
    'jato', 'kilo', 'lago', 'muro', 'neve', 'ouro', 'pico', 'rede',
    'sino', 'tela', 'urso', 'vale', 'yoga', 'zona', 'arco', 'barco',
    'carro', 'dama', 'flor', 'grama', 'hino', 'ilha', 'joia', 'livro',
    'mesa', 'nuvem', 'onda', 'peixe', 'raiz', 'selo', 'trem', 'vento'
];

let currentSeparator = '-';
let currentTab = 'memorable';
let currentPassword = '';

// Função para trocar entre abas
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab).classList.add('active');
}

// Atualiza o valor do slider
function updateSlider(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    valueDisplay.textContent = slider.value;
}

// Define o separador de palavras
function setSeparator(separator) {
    currentSeparator = separator;
    document.querySelectorAll('.separator-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Gera senha memorável
function generateMemorablePassword() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const capitalize = document.getElementById('capitalize').checked;
    const addNumbers = document.getElementById('addNumbers').checked;
    const addSymbols = document.getElementById('addSymbols').checked;

    let words = [];
    for (let i = 0; i < wordCount; i++) {
        let word = wordList[Math.floor(Math.random() * wordList.length)];
        if (capitalize) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);
    }

    let password = words.join(currentSeparator);

    if (addNumbers) {
        const number = Math.floor(Math.random() * 9000) + 1000;
        password += currentSeparator + number;
    }

    if (addSymbols) {
        const symbols = '!@#$%&*';
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        password += symbol;
    }

    currentPassword = password;
    displayPassword('mem', password);
    calculateStrength('mem', password);
    document.getElementById('memCopyBtn').disabled = false;
}

// Gera senha aleatória
function generateRandomPassword() {
    const length = parseInt(document.getElementById('length').value);
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        alert('Selecione pelo menos uma opção de caracteres!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    currentPassword = password;
    displayPassword('rand', password);
    calculateStrength('rand', password);
    document.getElementById('randCopyBtn').disabled = false;
}

// Exibe a senha gerada
function displayPassword(type, password) {
    const display = document.getElementById(type + 'Password');
    display.textContent = password;
    display.classList.remove('empty');
}

// Calcula a força da senha
function calculateStrength(type, password) {
    let strength = 0;
    
    // Comprimento
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Complexidade
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    const fill = document.getElementById(type + 'StrengthFill');
    const text = document.getElementById(type + 'StrengthText');

    let percentage, color, label;
    
    if (strength <= 2) {
        percentage = 25;
        color = '#ff4444';
        label = 'Fraca';
    } else if (strength <= 4) {
        percentage = 50;
        color = '#ff9800';
        label = 'Média';
    } else if (strength <= 6) {
        percentage = 75;
        color = '#2196F3';
        label = 'Boa';
    } else {
        percentage = 100;
        color = '#4CAF50';
        label = 'Forte';
    }

    fill.style.width = percentage + '%';
    fill.style.background = color;
    text.textContent = 'Força da senha: ' + label;
    text.style.color = color;
}

// Copia a senha para a área de transferência
function copyPassword(type) {
    navigator.clipboard.writeText(currentPassword).then(() => {
        const message = document.getElementById('copiedMessage');
        message.classList.add('show');
        setTimeout(() => {
            message.classList.remove('show');
        }, 2000);
    });
}

// Gerar senha inicial ao carregar a página
window.onload = function() {
    generateMemorablePassword();
};
