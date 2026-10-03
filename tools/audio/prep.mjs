// prep.mjs — build assets/audio from tools/audio/sounds.json: each source trimmed, folded to mono, normalised and
// encoded as MP3 (every browser decodes it, Safari included), plus assets/audio/bank.json (cue → its variants, with
// durations). One-shots: leading and trailing silence trimmed, the peak set to −1 dBFS (the engine sets levels per
// bus); voices levelled by their mean instead, so a cue's variants match. Loops: loudness set to −20 LUFS; `take` keeps the first N seconds (the engine crossfades a loop's seam, so
// MP3's padding never clicks).
//   FFMPEG=/path/to/ffmpeg FLARE=/path/to/flare-game node tools/audio/prep.mjs
//   (ffmpeg: any build with libmp3lame, e.g. `pip install imageio-ffmpeg`; FLARE: a checkout of flareteam/flare-game)
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), OUT = join(ROOT, 'assets', 'audio');
const FF = process.env.FFMPEG || 'ffmpeg', SRC = join(process.env.FLARE || '', 'mods', 'fantasycore', 'soundfx');
const spec = JSON.parse(readFileSync(join(ROOT, 'tools', 'audio', 'sounds.json'), 'utf8'));
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync(FF, ['-hide_banner', '-nostdin', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const measure = (file, filter) => spawnSync(FF, ['-hide_banner', '-nostdin', '-i', file, '-af', filter, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const durOf = (file) => { const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(spawnSync(FF, ['-hide_banner', '-i', file], { encoding: 'utf8' }).stderr); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0; };

const bank = { shots: {}, loops: {} }; let bytes = 0;
const VOICE = /^(gob|bone|man|woman|cult)_/;
const TRIM = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.005,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,areverse';
for (const [cue, list] of Object.entries(spec.shots)) {
  bank.shots[cue] = [];
  list.forEach((src, i) => {
    const inF = join(SRC, src), tmp = join(OUT, `_${cue}_${i}.wav`), out = join(OUT, `${cue}_${i + 1}.mp3`);
    ff(['-i', inF, '-af', `aformat=channel_layouts=mono,${TRIM}`, '-ar', '44100', tmp]);
    const vd = measure(tmp, 'volumedetect'), peak = +(/max_volume: (-?[\d.]+) dB/.exec(vd) || [0, 0])[1], mean = +(/mean_volume: (-?[\d.]+) dB/.exec(vd) || [0, 0])[1];
    // voices (sound critic pass 1): levelled by their mean, not their peak (a cue's variants sat 12.6 dB apart),
    // limited to −1 dBFS, and 3 dB off at 3.5 kHz, where a goblin's screech had nearly all its energy
    const voice = VOICE.test(cue), af = voice ? `equalizer=f=3500:t=q:w=1:g=-3,volume=${(-18 - mean).toFixed(2)}dB,alimiter=limit=0.89:level=false` : `volume=${(-1 - peak).toFixed(2)}dB`;
    ff(['-i', tmp, '-af', af, '-codec:a', 'libmp3lame', '-b:a', '80k', out]);
    rmSync(tmp); bytes += statSync(out).size;
    bank.shots[cue].push({ f: `${cue}_${i + 1}.mp3`, d: +durOf(out).toFixed(3) });
  });
}
for (const [cue, o] of Object.entries(spec.loops)) {
  const inF = join(SRC, o.src), out = join(OUT, `${cue}.mp3`);
  const take = o.take ? ['-t', String(o.take)] : [];
  ff(['-i', inF, ...take, '-af', 'aformat=channel_layouts=mono,loudnorm=I=-20:TP=-2:LRA=11:linear=true', '-ar', '44100', '-codec:a', 'libmp3lame', '-b:a', '64k', out]);
  bytes += statSync(out).size;
  bank.loops[cue] = { f: `${cue}.mp3`, d: +durOf(out).toFixed(3) };
}
writeFileSync(join(OUT, 'bank.json'), JSON.stringify(bank, null, 1) + '\n');
console.log(`assets/audio: ${Object.keys(bank.shots).length} one-shot cues (${Object.values(bank.shots).flat().length} files), ${Object.keys(bank.loops).length} loops, ${(bytes / 1024).toFixed(0)} KB`);
