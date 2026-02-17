// Lista expandida de palavras em português para senhas memoráveis
const wordList = [
    // Palavras curtas e memoráveis
    'sol', 'mar', 'lua', 'ceu', 'rio', 'paz', 'luz', 'som',
    'cor', 'mel', 'sal', 'cha', 'mel', 'uva', 'fio', 'flor',
    'amor', 'azul', 'cafe', 'casa', 'gato', 'pato', 'lago',
    'vale', 'neve', 'ouro', 'sino', 'tela', 'yoga', 'zona',
    'arco', 'dama', 'flor', 'hino', 'joia', 'mesa', 'onda',
    'raiz', 'selo', 'vela', 'lobo', 'urso', 'leao', 'coxa'
];

let currentSeparator = '-';
let currentTab = 'memorable';
let currentPassword = '';

// Inicialização ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    generatePassword();
    setupEventListeners();
});

function setupEventListeners() {
    // Sliders
    document.getElementById('wordCount').addEventListener('input', (e) => {
        document.getElementById('wordCountValue').textContent = e.target.value;
    });
    
    document.getElementById('length').addEventListener('input', (e) => {
        document.getElementById('lengthValue').textContent = e.target.value;
    });
}

// Função para trocar entre abas
function switchTab(tab) {
    currentTab = tab;
    
    // Atualizar tabs
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    event.target.closest('.tab').classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');
    
    // Gerar nova senha
    generatePassword();
}

// Define o separador de palavras
function setSeparator(separator) {
    currentSeparator = separator;
    document.querySelectorAll('.separator-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Função unificada para gerar senha
function generatePassword() {
    if (currentTab === 'memorable') {
        generateMemorablePassword();
    } else {
        generateRandomPassword();
    }
}

// Gera senha memorável
function generateMemorablePassword() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const capitalize = document.getElementById('capitalize').checked;
    const addNumbers = document.getElementById('addNumbers').checked;
    const addSymbols = document.getElementById('addSymbols').checked;

    // Gerar palavras únicas
    let words = [];
    let usedWords = new Set();
    
    while (words.length < wordCount) {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        if (!usedWords.has(word)) {
            usedWords.add(word);
            let processedWord = word;
            
            if (capitalize) {
                processedWord = processedWord.charAt(0).toUpperCase() + processedWord.slice(1);
            }
            
            words.push(processedWord);
        }
    }

    let password = words.join(currentSeparator);

    // Adicionar números (2 dígitos apenas)
    if (addNumbers) {
        const number = Math.floor(Math.random() * 90) + 10;
        password += (currentSeparator || '') + number;
    }

    // Adicionar um símbolo apenas
    if (addSymbols) {
        const symbols = '!@#$%&*';
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        password += symbol;
    }

    currentPassword = password;
    displayPassword(password);
    calculateStrength(password);
    enableCopyButton();
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
    if (symbols) charset += '!@#$%^&*';

    if (charset === '') {
        showToast('Selecione pelo menos uma opção de caracteres!', 'error');
        return;
    }

    // Gerar senha garantindo pelo menos um caractere de cada tipo selecionado
    let password = '';
    let charTypes = [];
    
    if (uppercase) charTypes.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (lowercase) charTypes.push('abcdefghijklmnopqrstuvwxyz');
    if (numbers) charTypes.push('0123456789');
    if (symbols) charTypes.push('!@#$%^&*');
    
    // Adicionar pelo menos um de cada tipo
    charTypes.forEach(type => {
        password += type[Math.floor(Math.random() * type.length)];
    });
    
    // Preencher o resto aleatoriamente
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Embaralhar a senha
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    currentPassword = password;
    displayPassword(password);
    calculateStrength(password);
    enableCopyButton();
}

// Exibe a senha gerada
function displayPassword(password) {
    const display = document.getElementById('passwordText');
    display.textContent = password;
    display.classList.remove('empty');
}

// Calcula a força da senha
function calculateStrength(password) {
    let strength = 0;
    let maxStrength = 7;
    
    // Critérios de força
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    const fill = document.getElementById('strengthFill');
    const value = document.getElementById('strengthValue');

    let percentage = (strength / maxStrength) * 100;
    let color, label;
    
    if (strength <= 2) {
        color = '#ef4444';
        label = 'Fraca';
    } else if (strength <= 4) {
        color = '#f59e0b';
        label = 'Média';
    } else if (strength <= 5) {
        color = '#3b82f6';
        label = 'Boa';
    } else {
        color = '#10b981';
        label = 'Forte';
    }

    fill.style.width = percentage + '%';
    fill.style.background = color;
    value.textContent = label;
    value.style.color = color;
}

// Habilita o botão de copiar
function enableCopyButton() {
    document.getElementById('copyBtn').disabled = false;
}

// Copia a senha para a área de transferência
function copyPassword() {
    if (!currentPassword) return;
    
    navigator.clipboard.writeText(currentPassword).then(() => {
        showToast('Senha copiada com sucesso!', 'success');
    }).catch(() => {
        showToast('Erro ao copiar senha', 'error');
    });
}

// Mostra mensagem toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
