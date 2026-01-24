const CONFIG = {
  nomeDaPessoa: 'Fernanda',
  suaAssinatura: 'Pedro',
  fotoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  titulo: 'Pra você, meu amor ❤️',
  subtitulo: 'Um pedacinho do meu coração, em forma de site.',
  textoDeclaracao:
    'Eu fiz esse site porque palavras soltas não são suficientes.\n\n'
    + 'Tu é casa, é calma, é caos bom.\n'
    + 'Mesmo quando o mundo pesa, tu é o lugar onde eu descanso.\n\n'
    + 'Obrigada por cada detalhe, cada cuidado, cada riso.\n'
    + 'Que a gente continue colecionando momentos e abraços, para sempre.',
  audioUrl: 'https://cdn.pixabay.com/audio/2022/10/26/audio_3bf9b8e236.mp3',
  musicLink: '',
  momentos: [
    'Nosso primeiro abraço que parecia encaixe perfeito.',
    'Aquela viagem em que rimos até a barriga doer.',
    'As noites tranquilas, com filme, pipoca e carinho.',
    'O olhar que sempre diz “estou aqui”.'
  ],
  sinceDate: '2022-02-14'
};

const elements = {
  titulo: document.getElementById('titulo'),
  subtitulo: document.getElementById('subtitulo'),
  nomeDaPessoa: document.getElementById('nomeDaPessoa'),
  fotoPrincipal: document.getElementById('fotoPrincipal'),
  declaracao: document.getElementById('declaracao'),
  assinatura: document.getElementById('assinatura'),
  momentosContainer: document.getElementById('momentosContainer'),
  contadorDias: document.getElementById('contadorDias'),
  toggleDeclaracao: document.getElementById('toggleDeclaracao'),
  botaoMusica: document.getElementById('botaoMusica'),
  audioPlayer: document.getElementById('audioPlayer'),
  musicLinkWrapper: document.getElementById('musicLinkWrapper'),
  musicLink: document.getElementById('musicLink'),
  musicStatus: document.getElementById('musicStatus'),
  enviarBeijo: document.getElementById('enviarBeijo'),
  copiarMensagem: document.getElementById('copiarMensagem'),
  copiarMensagem2: document.getElementById('copiarMensagem2'),
  toast: document.getElementById('toast'),
  toggleTema: document.getElementById('toggleTema')
};

function renderizarConteudo() {
  document.title = CONFIG.titulo;
  elements.titulo.textContent = CONFIG.titulo;
  elements.subtitulo.textContent = CONFIG.subtitulo;
  elements.nomeDaPessoa.textContent = `Oi, ${CONFIG.nomeDaPessoa}!`;
  elements.fotoPrincipal.src = CONFIG.fotoUrl;
  elements.fotoPrincipal.alt = `Foto de ${CONFIG.nomeDaPessoa}`;
  elements.declaracao.textContent = CONFIG.textoDeclaracao;
  elements.assinatura.textContent = `— Com amor, ${CONFIG.suaAssinatura}`;

  elements.momentosContainer.innerHTML = '';
  CONFIG.momentos.forEach((momento, index) => {
    const card = document.createElement('article');
    card.className = 'moment-card';

    const title = document.createElement('h4');
    title.textContent = `Momento ${index + 1}`;

    const text = document.createElement('p');
    text.textContent = momento;

    card.append(title, text);
    elements.momentosContainer.appendChild(card);
  });

  atualizarContador();
  ajustarBotaoDeclaracao();
}

function ajustarBotaoDeclaracao() {
  const hasLongText = CONFIG.textoDeclaracao.length > 320;
  elements.toggleDeclaracao.classList.toggle('hidden', !hasLongText);
  if (!hasLongText) {
    elements.declaracao.classList.add('expanded');
  }
}

function atualizarContador() {
  if (!CONFIG.sinceDate) {
    elements.contadorDias.textContent = '';
    return;
  }

  const inicio = new Date(`${CONFIG.sinceDate}T00:00:00`);
  const hoje = new Date();
  const diffMs = hoje.setHours(0, 0, 0, 0) - inicio.getTime();
  const dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  elements.contadorDias.textContent = `Desde ${formatarData(inicio)}: ${dias} dias juntinhos.`;
}

function formatarData(data) {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function setupMusica() {
  const audioUrl = CONFIG.audioUrl?.trim();
  const link = CONFIG.musicLink?.trim();
  const streaming = isStreamingLink(audioUrl) || isStreamingLink(link);

  if (audioUrl && !isStreamingLink(audioUrl)) {
    elements.audioPlayer.src = audioUrl;
    elements.musicLinkWrapper.classList.add('hidden');
  } else if (link || audioUrl) {
    const destino = link || audioUrl;
    elements.musicLink.href = destino;
    elements.musicLinkWrapper.classList.remove('hidden');
    elements.botaoMusica.disabled = true;
    elements.botaoMusica.textContent = '▶ Tocar';
    elements.musicStatus.textContent = 'Abra o link para ouvir.';
  }

  elements.botaoMusica.addEventListener('click', async () => {
    if (!elements.audioPlayer.src) {
      return;
    }

    if (elements.audioPlayer.paused) {
      try {
        await elements.audioPlayer.play();
        elements.botaoMusica.textContent = '⏸ Pausar';
        elements.musicStatus.textContent = 'Tocando agora.';
      } catch (error) {
        elements.musicStatus.textContent = 'Clique novamente para tocar.';
      }
    } else {
      elements.audioPlayer.pause();
      elements.botaoMusica.textContent = '▶ Tocar';
      elements.musicStatus.textContent = 'Pausado.';
    }
  });
}

function isStreamingLink(url) {
  if (!url) return false;
  return /youtube\.com|youtu\.be|spotify\.com/i.test(url);
}

function setupBotoes() {
  elements.toggleDeclaracao.addEventListener('click', () => {
    const expanded = elements.declaracao.classList.toggle('expanded');
    elements.toggleDeclaracao.textContent = expanded ? 'Ler menos' : 'Ler mais';
  });

  [elements.copiarMensagem, elements.copiarMensagem2].forEach((button) => {
    button.addEventListener('click', () => copiarMensagem(CONFIG.textoDeclaracao));
  });

  elements.enviarBeijo.addEventListener('click', animacaoCoracoes);
  elements.toggleTema.addEventListener('click', alternarTema);
}

async function copiarMensagem(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    toast('Copiado!');
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    toast('Copiado!');
  }
}

function animacaoCoracoes() {
  const duration = 2000;
  const interval = 150;
  const start = Date.now();

  const timer = setInterval(() => {
    const now = Date.now();
    if (now - start > duration) {
      clearInterval(timer);
      return;
    }

    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '💗';
    heart.style.left = `${20 + Math.random() * 60}%`;
    heart.style.bottom = `${10 + Math.random() * 20}px`;
    heart.style.fontSize = `${14 + Math.random() * 16}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2000);
  }, interval);
}

function toast(mensagem) {
  elements.toast.textContent = mensagem;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2000);
}

function alternarTema() {
  const isDark = document.body.classList.toggle('dark');
  elements.toggleTema.setAttribute('aria-pressed', String(isDark));
  elements.toggleTema.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo noturno';
  localStorage.setItem('temaPreferido', isDark ? 'dark' : 'light');
}

function carregarTema() {
  const tema = localStorage.getItem('temaPreferido');
  if (tema === 'dark') {
    document.body.classList.add('dark');
    elements.toggleTema.setAttribute('aria-pressed', 'true');
    elements.toggleTema.textContent = '☀️ Modo claro';
  }
}

renderizarConteudo();
setupMusica();
setupBotoes();
carregarTema();
