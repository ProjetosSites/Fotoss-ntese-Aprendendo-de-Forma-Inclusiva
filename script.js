const sinteseVoz = window.speechSynthesis;

function mudarAula(idAula) {
    if (sinteseVoz) {
        sinteseVoz.cancel();
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
        
        // Remove comandos específicos da leitura corrida
        textoParaLer = textoParaLer.replace(/🔊 Ouvir.*/g, "");

        const narracao = new SpeechSynthesisUtterance(textoParaLer);
        narracao.lang = 'pt-BR';
        narracao.rate = 1.0; 
        
        sinteseVoz.speak(narracao);
    }
}

function validarQuiz(event) {
    event.preventDefault();
    
    // Pegando as respostas marcadas
    const r1 = document.querySelector('input[name="q1"]:checked').value;
    const r2 = document.querySelector('input[name="q2"]:checked').value;
    const r3 = document.querySelector('input[name="q3"]:checked').value;
    
    const divResultado = document.getElementById('resultado-quiz');
    
    // Gabarito: 1=B (Processo alimento), 2=B (Sol), 3=A (Oxigênio)
    if (r1 === 'B' && r2 === 'B' && r3 === 'A') {
        divResultado.className = "resultado-box-mensagem sucesso";
        divResultado.innerText = "Parabéns! Você acertou todas as 3 questões objetivas sobre fotossíntese!";
    } else {
        divResultado.className = "resultado-box-mensagem erro";
        divResultado.innerText = "Alguma resposta ficou incorreta. Volte nas abas dos módulos anteriores para revisar e mude suas opções!";
    }
    
    // Feedback de Voz Automático para alunos cegos
    if (sinteseVoz) {
        sinteseVoz.cancel();
        const feedbackAudio = new SpeechSynthesisUtterance(divResultado.innerText);
        feedbackAudio.lang = 'pt-BR';
        sinteseVoz.speak(feedbackAudio);
    }
}
// Cole isto no final do seu script.js

let audioRealAtual = null; // Guarda o áudio que está a tocar para podermos pará-lo

function tocarAudioReal(nomeDoArquivo) {
    // 1. Se o robô do navegador estiver a falar, cancela a voz dele
    if (sinteseVoz) {
        sinteseVoz.cancel();
    }
    
    // 2. Se já houver outro áudio gravado a tocar, para o anterior
    if (audioRealAtual) {
        audioRealAtual.pause();
        audioRealAtual.currentTime = 0;
    }

    // 3. Cria e toca o seu arquivo gravado
    audioRealAtual = new Audio(nomeDoArquivo);
    audioRealAtual.play();
}
