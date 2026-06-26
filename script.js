const sinteseVoz = window.speechSynthesis;

// Novas variáveis para controlar o visual do botão
let audioRealAtual = null; 
let arquivoTocando = ""; 
let botaoAudioAtual = null; // Memoriza qual botão foi clicado
let textoOriginalBotao = ""; // Memoriza o texto ("🔊 Ouvir...")

// Função para fazer o botão voltar ao normal
function resetarBotaoAudio() {
    if (botaoAudioAtual) {
        botaoAudioAtual.innerHTML = textoOriginalBotao; 
        botaoAudioAtual = null;
    }
}

function mudarAula(idAula) {
    if (sinteseVoz) {
        sinteseVoz.cancel();
    }
    
    if (audioRealAtual) {
        audioRealAtual.pause();
        audioRealAtual.currentTime = 0;
        resetarBotaoAudio(); // Faz o botão voltar ao normal ao trocar de página
    }

    const todasSecoes = document.querySelectorAll('.secao-aula');
    todasSecoes.forEach(secao => secao.classList.remove('ativa'));

    const secaoAlvo = document.getElementById(idAula);
    if (secaoAlvo) {
        secaoAlvo.classList.add('ativa');

        const tituloAula = secaoAlvo.querySelector('h2');
        if (tituloAula) {
            tituloAula.setAttribute('tabindex', '-1');
            tituloAula.focus();
        }
    }

    const todosBotoes = document.querySelectorAll('.menu-curso button');
    todosBotoes.forEach(btn => btn.removeAttribute('aria-current'));

    const botaoAtivo = document.getElementById('btn-' + idAula);
    if (botaoAtivo) {
        botaoAtivo.setAttribute('aria-current', 'step');
    }
}

function lerTextoAtual(idSecao) {
    if (!sinteseVoz) {
        alert("Navegador não suporta síntese de voz.");
        return;
    }

    sinteseVoz.cancel();

    const secao = document.getElementById(idSecao);
    if (secao) {
        const cardTexto = secao.querySelector('.card-texto');
        let textoParaLer = cardTexto ? cardTexto.innerText : secao.innerText;
        
        textoParaLer = textoParaLer.replace(/🔊 Ouvir.*/g, "");

        const narracao = new SpeechSynthesisUtterance(textoParaLer);
        narracao.lang = 'pt-BR';
        narracao.rate = 1.0; 
        
        sinteseVoz.speak(narracao);
    }
}

function validarQuiz(event) {
    event.preventDefault();
    
    const r1 = document.querySelector('input[name="q1"]:checked').value;
    const r2 = document.querySelector('input[name="q2"]:checked').value;
    const r3 = document.querySelector('input[name="q3"]:checked').value;
    
    const divResultado = document.getElementById('resultado-quiz');
    
    if (r1 === 'B' && r2 === 'B' && r3 === 'A') {
        divResultado.className = "resultado-box-mensagem sucesso";
        divResultado.innerText = "Parabéns! Você acertou todas as 3 questões objetivas sobre fotossíntese!";
    } else {
        divResultado.className = "resultado-box-mensagem erro";
        divResultado.innerText = "Alguma resposta ficou incorreta. Volte nas abas dos módulos anteriores para revisar e mude suas opções!";
    }
    
    if (sinteseVoz) {
        sinteseVoz.cancel();
        const feedbackAudio = new SpeechSynthesisUtterance(divResultado.innerText);
        feedbackAudio.lang = 'pt-BR';
        sinteseVoz.speak(feedbackAudio);
    }
}

// === NOVA LÓGICA DE ÁUDIO COM FEEDBACK VISUAL === //

function tocarAudioReal(nomeDoArquivo, elementoBotao) {
    if (sinteseVoz) {
        sinteseVoz.cancel();
    }
    
    if (audioRealAtual && arquivoTocando === nomeDoArquivo) {
        if (!audioRealAtual.paused) {
            audioRealAtual.pause();
            elementoBotao.innerHTML = "▶️ Continuar Áudio"; // Visual: Pausado
            return;
        } else {
            audioRealAtual.play();
            elementoBotao.innerHTML = "⏸️ Pausar Áudio"; // Visual: Tocando
            return;
        }
    }

    if (audioRealAtual) {
        audioRealAtual.pause();
        audioRealAtual.currentTime = 0;
        resetarBotaoAudio(); // Reseta o botão anterior se o aluno der play em outro
    }

    audioRealAtual = new Audio(nomeDoArquivo);
    arquivoTocando = nomeDoArquivo;
    
    // Salva quem é o botão clicado para podermos alterá-lo
    botaoAudioAtual = elementoBotao;
    textoOriginalBotao = elementoBotao.innerHTML; 
    
    audioRealAtual.play();
    elementoBotao.innerHTML = "⏸️ Pausar Áudio"; // Visual: Começou a tocar

    // Quando o áudio chega ao fim sozinho, o botão volta a ser "🔊 Ouvir"
    audioRealAtual.onended = function() {
        resetarBotaoAudio();
    };
}
