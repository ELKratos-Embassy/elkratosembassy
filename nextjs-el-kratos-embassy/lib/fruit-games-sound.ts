let audio: AudioContext | null = null;

function context() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audio = new Ctx();
  }
  if (audio.state === "suspended") void audio.resume();
  return audio;
}

export function unlockSound() {
  context();
}

function tone(frequency: number, duration: number, type: OscillatorType, volume: number, slide = 0) {
  const ctx = context();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (slide) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(48, frequency + slide), ctx.currentTime + duration);
  }
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

export function playTick(remaining: number, total: number) {
  if (remaining <= 0) {
    tone(140, 0.28, "sawtooth", 0.05, -70);
    return;
  }
  const urgent = remaining <= Math.max(5, Math.round(total * 0.2));
  const warn = remaining <= Math.max(10, Math.round(total * 0.5));
  tone(urgent ? 880 : warn ? 520 : 340, urgent ? 0.09 : 0.05, "square", urgent ? 0.045 : 0.02);
}

export function playBuzz() {
  tone(220, 0.16, "sawtooth", 0.06, 180);
  window.setTimeout(() => tone(440, 0.22, "triangle", 0.07, 220), 90);
}

export function playHit() {
  tone(523, 0.18, "triangle", 0.07);
  window.setTimeout(() => tone(659, 0.18, "triangle", 0.06), 80);
  window.setTimeout(() => tone(784, 0.32, "triangle", 0.07), 160);
}

export function playMiss() {
  tone(196, 0.22, "sawtooth", 0.05, -80);
  window.setTimeout(() => tone(110, 0.28, "triangle", 0.05), 120);
}
