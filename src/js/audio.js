// Sound Effects Handler using Web Audio API & Web Speech API

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const Sound = {
  // Tactile button tap sound (pleasant Duolingo-like pop/click)
  playClick() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Fallback silent fail
    }
  },

  // Error alert sound (low warning double tone)
  playError() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Fallback
    }
  },

  // Festive Success Fanfare (Celebration major chord progression C5 - E5 - G5 - C6)
  playSuccess() {
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const duration = 0.12;

      notes.forEach((freq, idx) => {
        const startTime = ctx.currentTime + idx * duration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + (idx === notes.length - 1 ? 0.4 : duration + 0.05));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + (idx === notes.length - 1 ? 0.4 : duration + 0.05));
      });
    } catch (e) {
      // Fallback
    }
  },

  // Native Speech Synthesis (Voz en español es-MX)
  speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 0.95; // Slightly slower rate for clear children comprehension
      utterance.pitch = 1.0;

      // Prioritize Mexican Spanish voice if available in the browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const esMxVoice = voices.find(v => v.lang.toLowerCase() === 'es-mx') ||
                          voices.find(v => v.lang.toLowerCase().startsWith('es'));
        if (esMxVoice) {
          utterance.voice = esMxVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Error al reproducir síntesis de voz:', e);
    }
  },

  // Dictado de denominación ingresada (ej. "5 pesos", "1 peso", "20 pesos")
  speakAmount(amount) {
    if (!amount && amount !== 0) return;
    if (amount === 1) {
      this.speak('1 peso');
    } else {
      this.speak(`${amount} pesos`);
    }
  },

  speakChange(changeAmount, breakdown = []) {
    if (changeAmount <= 0) {
      this.speak('¡Pago exacto! No hay cambio que entregar.');
      return;
    }

    let speechText = `El cambio es de ${changeAmount} pesos. Entrega al cliente: `;
    const parts = breakdown.map(item => {
      const denomText = item.type === 'billete' ? 'billete' : 'moneda';
      const pluralDenom = item.count > 1 ? (denomText === 'billete' ? 'billetes' : 'monedas') : denomText;
      const pesoUnit = item.value === 1 ? 'peso' : 'pesos';
      return `${item.count} ${pluralDenom} de ${item.value} ${pesoUnit}`;
    });

    if (parts.length === 1) {
      speechText += parts[0] + '.';
    } else if (parts.length === 2) {
      speechText += `${parts[0]} y ${parts[1]}.`;
    } else {
      const last = parts.pop();
      speechText += `${parts.join(', ')} y ${last}.`;
    }

    this.speak(speechText);
  }
};
