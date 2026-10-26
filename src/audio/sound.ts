import { audioManifest, getWord } from '../data';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Synthesize pleasant UI sound effects with Web Audio API
export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Two-tone cheerful chime (C5 -> G5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.1);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.35);
  } catch (e) {
    // Silent fallback
  }
}

export function playIncorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Low soft buzz/thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    // Silent fallback
  }
}

export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    // Silent fallback
  }
}

// Fallback to Web Speech Synthesis if audio files are not present
function speakSpeechSynthesis(text: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = rate;

    // Try finding British English voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(v => v.lang.toLowerCase().includes('en-gb') || v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('emma'));
    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

let activeAudio: HTMLAudioElement | null = null;

export async function stopAudio(): Promise<void> {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playWordAudio(wordStr: string): Promise<void> {
  await stopAudio();
  const word = getWord(wordStr);
  if (!word) return;

  const key = `${word.word.toLowerCase()}:word`;
  const clip = audioManifest?.clips?.[key];
  const audioPath = clip?.path ? `./${clip.path}` : `./audio/emma/${word.word.toLowerCase()}-word.wav`;

  return new Promise((resolve) => {
    const audio = new Audio(audioPath);
    activeAudio = audio;
    audio.playbackRate = 1.0;

    audio.onended = () => {
      activeAudio = null;
      resolve();
    };

    audio.onerror = async () => {
      activeAudio = null;
      // Fallback to speech synthesis
      await speakSpeechSynthesis(word.word, 1.0);
      resolve();
    };

    audio.play().catch(async () => {
      activeAudio = null;
      await speakSpeechSynthesis(word.word, 1.0);
      resolve();
    });
  });
}

export async function playSentenceAudio(wordStr: string, sentenceOverride?: string): Promise<void> {
  await stopAudio();
  const word = getWord(wordStr);
  const sentence = sentenceOverride || word?.context_sentence || wordStr;

  const key = `${wordStr.toLowerCase()}:sentence`;
  const clip = audioManifest?.clips?.[key];
  const audioPath = clip?.path ? `./${clip.path}` : `./audio/emma/${wordStr.toLowerCase()}-sentence.wav`;

  return new Promise((resolve) => {
    const audio = new Audio(audioPath);
    activeAudio = audio;
    // Context sentences played at 0.8x as specified
    audio.playbackRate = 0.8;

    audio.onended = () => {
      activeAudio = null;
      resolve();
    };

    audio.onerror = async () => {
      activeAudio = null;
      await speakSpeechSynthesis(sentence, 0.8);
      resolve();
    };

    audio.play().catch(async () => {
      activeAudio = null;
      await speakSpeechSynthesis(sentence, 0.8);
      resolve();
    });
  });
}

