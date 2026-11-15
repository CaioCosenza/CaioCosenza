// Gera os SVGs animados do perfil do GitHub no estilo do portfólio (cosenza-tech.netlify.app)
// e do Camada 8. Uso: node tools/gerar.mjs   (escreve em assets/)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (n, s) => fs.writeFileSync(path.join(raiz, 'assets', n), s.replace(/\n\s*/g, '\n').trim() + '\n');

// cores do portfólio
const C = { bg: '#05080a', panel: '#0a1114', bd: '#12342c', g: '#00ff9c', c: '#22d3ee', tx: '#c9ddd6', mut: '#6f8f84', r: '#ff3b6b', hi: '#eafff6' };
const MONO = `ui-monospace,'JetBrains Mono','Fira Code',Menlo,Consolas,'DejaVu Sans Mono',monospace`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const RM = `@media (prefers-reduced-motion:reduce){*{animation:none!important}.rm-hide{display:none}}`;

// gerador pseudo-aleatório fixo, para o SVG sair igual a cada execução
let seed = 8;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const CH = '01<>{}[]/$#%&*+=;:~ABCDEF8';

// largura aproximada de um caractere monoespaçado
const cw = (size) => size * 0.6;

// linha "digitada": texto coberto por um retângulo da cor do fundo que anda para a direita aos saltos
function digitar({ id, x, y, size, text, fill, start, dur, bg, weight = 400, cursor = false, hold = false }) {
  const w = Math.ceil(text.length * cw(size)) + 4;
  const n = text.length;
  let css = `.${id}-cv{animation:${id}-t ${dur}s steps(${n},end) ${start}s both}
  @keyframes ${id}-t{from{transform:translateX(0)}to{transform:translateX(${w}px)}}`;
  let svg = `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(text)}</text>
  <rect class="${id}-cv" x="${x - 1}" y="${y - size}" width="${w + 2}" height="${size * 1.4}" fill="${bg}"/>`;
  if (cursor) {
    css += `.${id}-cu{animation:${id}-t ${dur}s steps(${n},end) ${start}s both,blink 1s steps(1) infinite}
    .${id}-cuw{animation:${id}-on 0s ${start}s both${hold ? '' : `,${id}-off 0s ${start + dur + 0.6}s forwards`}}
    @keyframes ${id}-on{from{opacity:0}to{opacity:1}}@keyframes ${id}-off{to{opacity:0}}`;
    svg += `<g class="${id}-cuw"><rect class="${id}-cu" x="${x}" y="${y - size * 0.82}" width="${cw(size)}" height="${size * 1.05}" fill="${C.g}"/></g>`;
  }
  return { css, svg };
}

// ---------- 1. cabeçalho ----------
function header() {
  const W = 1200, H = 360;
  // chuva de caracteres
  let rain = '', rcss = '';
  for (let i = 0; i < 34; i++) {
    const x = 14 + i * 35.5 + rnd() * 8;
    const len = 8 + Math.floor(rnd() * 10);
    let t = '';
    for (let k = 0; k < len; k++) t += `<tspan x="${x.toFixed(1)}" dy="18">${esc(CH[Math.floor(rnd() * CH.length)])}</tspan>`;
    const dur = (7 + rnd() * 9).toFixed(1), del = (-rnd() * 14).toFixed(1);
    rain += `<text class="rn" style="animation-duration:${dur}s;animation-delay:${del}s" y="-${len * 18}" font-size="14" fill="${C.g}" opacity="${(0.12 + rnd() * 0.18).toFixed(2)}">${t}</text>`;
  }
  rcss = `.rn{animation:rain linear infinite}@keyframes rain{from{transform:translateY(0)}to{transform:translateY(${H + 420}px)}}`;

  const tx = 330;
  const sub = digitar({ id: 'sb', x: tx, y: 248, size: 24, text: '> Técnico de TI · Redes · Cibersegurança', fill: C.g, start: 1.1, dur: 2.2, bg: C.bg, cursor: true, hold: true });
  const nome = 'Caio Cosenza';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="Caio Cosenza — Técnico de TI, Redes e Cibersegurança">
  <style>
  ${rcss}
  .blinkdot{animation:blink 1.6s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  .ring{transform-origin:170px 180px;animation:spin 18s linear infinite}
  .ring2{transform-origin:170px 180px;animation:spin 26s linear infinite reverse}
  @keyframes spin{to{transform:rotate(360deg)}}
  .lock{animation:pulse 3s ease-in-out infinite alternate}
  @keyframes pulse{from{opacity:.75}to{opacity:1}}
  .scan{animation:scan 5s linear infinite}
  @keyframes scan{from{transform:translateY(-40px)}to{transform:translateY(${H + 40}px)}}
  .g1,.g2{opacity:0}
  .g1{animation:gl 4.5s steps(1) infinite}
  .g2{animation:gl 4.5s steps(1) .4s infinite}
  @keyframes gl{0%,86%,100%{opacity:0;transform:none}88%{opacity:.85;transform:translate(4px,-1px)}91%{opacity:.85;transform:translate(-5px,1px)}94%{opacity:.6;transform:translate(2px,0)}}
  .in{animation:fin .8s ease-out both}
  @keyframes fin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  ${sub.css}
  ${RM}
  </style>
  <defs>
    <pattern id="sl" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.4" fill="#000" opacity=".35"/></pattern>
    <radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient>
    <linearGradient id="sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.g}" stop-opacity="0"/><stop offset="1" stop-color="${C.g}" stop-opacity=".09"/></linearGradient>
    <clipPath id="top"><rect width="${W}" height="190"/></clipPath>
    <clipPath id="bot"><rect y="190" width="${W}" height="${H}"/></clipPath>
    <filter id="glw" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <g class="rm-hide">${rain}</g>
  <rect width="${W}" height="${H}" fill="url(#vg)"/>

  <!-- emblema: anel girando + cadeado -->
  <g class="in">
    <circle cx="170" cy="180" r="108" fill="${C.panel}" stroke="${C.bd}" stroke-width="2"/>
    <circle class="ring" cx="170" cy="180" r="100" fill="none" stroke="${C.g}" stroke-width="3" stroke-dasharray="48 14 6 14" opacity=".9"/>
    <circle class="ring2" cx="170" cy="180" r="86" fill="none" stroke="${C.c}" stroke-width="1.5" stroke-dasharray="3 9" opacity=".7"/>
    <g class="lock" fill="none" stroke="${C.g}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M146,172 v-20 a24,24 0 0 1 48,0 v20" filter="url(#glw)" opacity=".6"/>
      <path d="M146,172 v-20 a24,24 0 0 1 48,0 v20"/>
      <rect x="132" y="172" width="76" height="58" rx="9" fill="${C.bg}"/>
      <path d="M170,193 v14" stroke-width="8"/>
    </g>
  </g>

  <!-- etiqueta -->
  <g class="in" style="animation-delay:.15s">
    <rect x="${tx}" y="74" width="300" height="34" fill="none" stroke="${C.bd}" stroke-width="1.5"/>
    <circle class="blinkdot" cx="${tx + 18}" cy="91" r="5" fill="${C.g}"/>
    <text x="${tx + 34}" y="97" font-size="15" fill="${C.g}" letter-spacing="1.5">SESSÃO SEGURA · ONLINE</text>
  </g>

  <!-- nome com glitch -->
  <g class="in" style="animation-delay:.3s" font-size="72" font-weight="700">
    <text x="${tx}" y="186" fill="${C.hi}">${nome}</text>
    <text class="g1" x="${tx}" y="186" fill="${C.c}" clip-path="url(#top)">${nome}</text>
    <text class="g2" x="${tx}" y="186" fill="${C.r}" clip-path="url(#bot)">${nome}</text>
  </g>

  ${sub.svg}

  <g class="in" style="animation-delay:3.4s" font-size="17" fill="${C.mut}">
    <text x="${tx}" y="300"><tspan fill="${C.g}">caio@secure</tspan>:<tspan fill="${C.c}">~</tspan>$ ./portugal --suporte --redes --firewall --vpn</text>
  </g>

  <rect class="scan rm-hide" y="0" width="${W}" height="40" fill="url(#sc)"/>
  <rect width="${W}" height="${H}" fill="url(#sl)"/>
  <path d="M0,${H - 1} H${W}" stroke="${C.g}" stroke-width="2" opacity=".55"/>
  <path d="M0,0 h26 M0,0 v26 M${W},${H} h-26 M${W},${H} v-26" stroke="${C.g}" stroke-width="4"/>
</svg>`;
}

// ---------- 2. terminal (whoami) ----------
function terminal() {
  const W = 1200, H = 300, x = 34;
  const linhas = [
    ['$ whoami', 'caio.cosenza'],
    ['$ cat funcao.txt', 'Suporte técnico | Redes | Cibersegurança'],
    ['$ echo $LOCAL', 'Portugal'],
  ];
  let css = '', svg = '';
  let t = 0.6, y = 92;
  linhas.forEach(([cmd, res], i) => {
    const d = digitar({ id: `c${i}`, x, y, size: 21, text: cmd, fill: C.g, start: t, dur: cmd.length * 0.05, bg: C.panel, cursor: true });
    css += d.css; svg += d.svg;
    t += cmd.length * 0.05 + 0.35;
    css += `.o${i}{animation:fo .01s ${t}s both}`;
    svg += `<text class="o${i}" x="${x}" y="${y + 30}" font-size="21" fill="${C.tx}">${esc(res)}</text>`;
    t += 0.45; y += 66;
  });
  css += `.pr{animation:fo .01s ${t}s both}`;
  svg += `<g class="pr"><text x="${x}" y="${y}" font-size="21" fill="${C.g}">$</text><rect class="blink" x="${x + 20}" y="${y - 17}" width="12.6" height="22" fill="${C.g}"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="Terminal: whoami caio.cosenza; função Suporte técnico, Redes, Cibersegurança; local Portugal">
  <style>
  @keyframes blink{50%{opacity:0}}
  .blink{animation:blink 1s steps(1) infinite}
  @keyframes fo{from{opacity:0}to{opacity:1}}
  ${css}
  ${RM}
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="${C.panel}" stroke="${C.bd}" stroke-width="2"/>
  <rect x="1" y="1" width="${W - 2}" height="40" fill="#0d171b"/>
  <path d="M1,41 H${W - 1}" stroke="${C.bd}" stroke-width="2"/>
  <circle cx="26" cy="21" r="7" fill="${C.r}"/><circle cx="50" cy="21" r="7" fill="#ffbd2e"/><circle cx="74" cy="21" r="7" fill="${C.g}"/>
  <text x="${W / 2}" y="27" font-size="15" fill="${C.mut}" text-anchor="middle">bash — caio@secure</text>
  ${svg}
  <path d="M${W - 1},${H - 30} v29 h-29" stroke="${C.g}" stroke-width="4" fill="none"/>
</svg>`;
}

// ---------- 3. títulos de seção  [01] sobre / ----------
function titulo(num, nome) {
  const W = 1200, H = 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="${num} ${nome}">
  <style>.ln{transform-origin:left;animation:ln 1.2s ease-out .2s both}@keyframes ln{from{transform:scaleX(0)}to{transform:scaleX(1)}}.cu{animation:b 1s steps(1) infinite}@keyframes b{50%{opacity:0}}${RM}</style>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <text x="24" y="42" font-size="30" font-weight="700"><tspan fill="${C.g}">[${num}]</tspan><tspan fill="${C.hi}" dx="12">${esc(nome)}</tspan><tspan fill="${C.mut}"> /</tspan><tspan class="cu" fill="${C.g}" font-weight="400"> █</tspan></text>
  <path class="ln" d="M24,${H - 4} H${W - 24}" stroke="${C.bd}" stroke-width="2"/>
  <path class="ln" d="M24,${H - 4} H170" stroke="${C.g}" stroke-width="2"/>
</svg>`;
}

// ---------- 4. cartão do Camada 8 com o logo animado ----------
function camada8() {
  const W = 1200, H = 330, L = 220; // L = tamanho do logo
  const R = (x, y, w, h, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" pathLength="1"/>`;
  const oito = `${R(206, 116, 100, 110, 36)}${R(192, 246, 128, 150, 46)}`;
  const camadas = [380, 344.6, 309.1, 273.7, 238.3, 202.9, 167.4, 132]
    .map((y, i) => `<path d="M112,${y} H160 M352,${y} H400" stroke="${i === 7 ? '#F0142F' : '#0E5C33'}"/>`).join('');
  const stats = [['10 mil+', 'seguidores'], ['400 mil+', 'views num só Reel'], ['30+', 'vídeos publicados']];
  const sx = 330;
  let st = '';
  stats.forEach(([b, s], i) => {
    const x = sx + i * 280;
    st += `<g class="in" style="animation-delay:${1.6 + i * 0.15}s"><rect x="${x}" y="218" width="262" height="72" fill="${C.bg}" stroke="${C.bd}" stroke-width="1.5"/>
    <text x="${x + 18}" y="250" font-size="26" font-weight="700" fill="${C.hi}">${b}</text>
    <text x="${x + 18}" y="276" font-size="15" fill="${C.mut}">${s}</text></g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="Camada 8, canal de cibersegurança no Instagram @camada.8">
  <style>
  .o rect{stroke-dasharray:1;animation:draw 1s cubic-bezier(.65,0,.35,1) .3s both}
  .rd .o rect{animation-delay:.42s}
  .ly path{animation:fi .2s ease-out both}
  ${[2, 3, 4, 5, 6, 7].map((n) => `.ly path:nth-child(${n}){animation-delay:${(n - 1) * 0.05}s}`).join('')}
  .ly path:nth-child(8){animation:fl .5s .5s both}
  .gw{opacity:.35;animation:pu 3.2s ease-in-out 2.2s infinite alternate}
  .rd{opacity:.8;transform:translateX(-8px);animation:g1 .36s steps(1,end) 1.3s both}
  .s2{transform:translateX(18px);animation:g2 .36s steps(1,end) 1.3s both}
  .s3{transform:translateX(-16px);animation:g3 .36s steps(1,end) 1.3s both}
  .j2{animation:j2 7s steps(1,end) 4s infinite}
  .j3{animation:j3 7s steps(1,end) 4s infinite}
  .tr{animation:sh .32s steps(1,end) 1.3s}
  .ey{animation:fl .5s 1.6s both}
  .in{animation:fin .7s ease-out both}
  .blink{animation:fl2 1.6s steps(1) infinite}
  @keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  @keyframes fl{0%{opacity:0}30%{opacity:1}45%{opacity:.2}60%,100%{opacity:1}}
  @keyframes fl2{50%{opacity:0}}
  @keyframes fin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes sh{0%{transform:translate(6px,-3px)}25%{transform:translate(-7px,2px)}50%{transform:translate(4px,3px)}75%{transform:translate(-3px,-2px)}100%{transform:none}}
  @keyframes g1{0%{transform:none}20%{transform:translateX(-22px)}45%{transform:translateX(10px)}70%{transform:translateX(-14px)}100%{transform:translateX(-8px)}}
  @keyframes g2{0%{transform:none}20%{transform:translateX(34px)}45%{transform:translateX(-14px)}70%{transform:translateX(26px)}100%{transform:translateX(18px)}}
  @keyframes g3{0%{transform:none}20%{transform:translateX(-30px)}45%{transform:translateX(12px)}70%{transform:translateX(-24px)}100%{transform:translateX(-16px)}}
  @keyframes pu{from{opacity:.28}to{opacity:.6}}
  @keyframes j2{0%,93%,100%{transform:none}94%{transform:translateX(14px)}96%{transform:translateX(-10px)}98%{transform:translateX(6px)}}
  @keyframes j3{0%,93%,100%{transform:none}94%{transform:translateX(-12px)}96%{transform:translateX(9px)}98%{transform:translateX(-5px)}}
  ${RM}
  </style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="${C.panel}" stroke="${C.bd}" stroke-width="2"/>
  <path d="M1,30 V1 H30" stroke="${C.g}" stroke-width="4" fill="none"/>
  <path d="M${W - 1},${H - 30} V${H - 1} H${W - 30}" stroke="${C.g}" stroke-width="4" fill="none"/>

  <svg x="50" y="${(H - L) / 2}" width="${L}" height="${L}" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#07100B"/><stop offset="1" stop-color="#010201"/></radialGradient>
      <pattern id="scan" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="2" fill="#000" opacity=".45"/></pattern>
      <filter id="glow" x="-80%" y="-200%" width="260%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
      <clipPath id="k1"><rect width="512" height="186"/><rect y="206" width="512" height="112"/><rect y="336" width="512" height="176"/></clipPath>
      <clipPath id="k2"><rect y="186" width="512" height="20"/></clipPath>
      <clipPath id="k3"><rect y="318" width="512" height="18"/></clipPath>
    </defs>
    <rect width="512" height="512" fill="url(#bg)" stroke="${C.bd}" stroke-width="6"/>
    <g class="tr">
      <g class="ly" stroke-width="8">${camadas}</g>
      <g class="gw o" fill="none" stroke="#00FF66" stroke-width="20" filter="url(#soft)">${oito}</g>
      <g class="rd"><g class="o" fill="none" stroke="#F0142F" stroke-width="20">${oito}</g></g>
      <g clip-path="url(#k1)"><g class="o" fill="none" stroke="#00FF66" stroke-width="20">${oito}</g></g>
      <g clip-path="url(#k2)"><g class="s2"><g class="j2"><g class="o" fill="none" stroke="#00FF66" stroke-width="20">${oito}</g></g></g></g>
      <g clip-path="url(#k3)"><g class="s3"><g class="j3"><g class="o" fill="none" stroke="#00FF66" stroke-width="20">${oito}</g></g></g></g>
      <g class="ey" fill="#F0142F"><path d="M229,163 h19 v8 h-19z M264,163 h19 v8 h-19z" filter="url(#glow)"/><path d="M229,163 h19 v8 h-19z M264,163 h19 v8 h-19z"/></g>
    </g>
    <rect width="512" height="512" fill="url(#scan)"/>
  </svg>

  <g class="in" style="animation-delay:.8s">
    <text x="${sx}" y="88" font-size="30" font-weight="700" fill="${C.g}">Camada 8 · @camada.8</text>
    <text x="${sx}" y="128" font-size="18" fill="${C.tx}">Canal de cibersegurança em linguagem simples, para todos.</text>
    <text x="${sx}" y="158" font-size="18" fill="${C.tx}">O modelo OSI tem sete camadas, e a oitava é o utilizador:</text>
    <text x="${sx}" y="188" font-size="18" fill="${C.tx}">onde começa a maior parte dos incidentes.<tspan class="blink" fill="${C.g}"> █</tspan></text>
  </g>
  ${st}
</svg>`;
}

// ---------- 5. rodapé ----------
function rodape() {
  const W = 1200, H = 120;
  const d = digitar({ id: 'q', x: 34, y: 78, size: 22, text: '"Segurança não é um produto, é um processo."', fill: C.tx, start: 0.6, dur: 2.4, bg: C.bg, cursor: true, hold: true });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="Segurança não é um produto, é um processo.">
  <style>@keyframes blink{50%{opacity:0}}${d.css}${RM}</style>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <path d="M24,2 H${W - 24}" stroke="${C.bd}" stroke-width="2"/>
  <text x="34" y="42" font-size="17" fill="${C.mut}"><tspan fill="${C.g}">caio@secure</tspan>:<tspan fill="${C.c}">~</tspan>$ cat lema.txt</text>
  ${d.svg}
</svg>`;
}

// ---------- 6. badges de skills com o ícone de cada marca ----------
// Ícones: Simple Icons (CC0) em tools/icones; Nmap (olho) e Sophos (escudo) desenhados aqui, simplificados.
const icone = (nome) => fs.readFileSync(path.join(raiz, 'tools', 'icones', nome + '.svg'), 'utf8').match(/ d="([^"]+)"/)[1];
const PROPRIOS = {
  nmap: `<path fill-rule="evenodd" d="M12 5C6.6 5 2.8 9 1 12c1.8 3 5.6 7 11 7s9.2-4 11-7c-1.8-3-5.6-7-11-7zm0 2.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm0 2.2a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4z"/>`,
  sophos: `<path d="M12 1 3 4.6v6.1c0 5.7 3.8 10.6 9 12.3 5.2-1.7 9-6.6 9-12.3V4.6z"/><text x="12" y="16.6" font-size="12" font-weight="700" text-anchor="middle" fill="${C.panel}" font-family="Arial,Helvetica,sans-serif">S</text>`,
};
function badge(rotulo, ic) {
  const H = 32, fs_ = 12, ls = 1.2, pad = 12, isz = 16;
  const tw = Math.ceil(rotulo.length * (cw(fs_) + ls));
  const W = pad + isz + 9 + tw + pad;
  const glifo = PROPRIOS[ic] || `<path d="${icone(ic)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="${esc(rotulo)}">
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" fill="${C.panel}" stroke="${C.bd}" stroke-width="1.5"/>
  <path d="M.75,8 V.75 H8" stroke="${C.g}" stroke-width="1.5" fill="none"/>
  <svg x="${pad}" y="${(H - isz) / 2}" width="${isz}" height="${isz}" viewBox="0 0 24 24" fill="${C.g}">${glifo}</svg>
  <text x="${pad + isz + 9}" y="${H / 2 + 4.3}" font-size="${fs_}" font-weight="700" letter-spacing="${ls}" fill="${C.hi}">${esc(rotulo.toUpperCase())}</text>
</svg>`;
}
export const SKILLS = [
  ['Cisco', 'cisco'], ['Wireshark', 'wireshark'], ['pfSense', 'pfsense'], ['Sophos', 'sophos'], ['OpenVPN', 'openvpn'],
  ['Kali Linux', 'kalilinux'], ['Nmap', 'nmap'], ['Windows Server', 'windows'], ['Active Directory', 'windows'],
  ['Linux', 'linux'], ['SQL Server', 'microsoftsqlserver'], ['Python', 'python'],
];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
SKILLS.forEach(([r, ic]) => out(`skill-${slug(r)}.svg`, badge(r, ic)));

// ---------- 7. janelas de terminal com conteúdo (sobre, experiência, áreas) ----------
// linhas: { cmd } = comando digitado; { t, c, b, ind } = saída (texto, cor, negrito, recuo em caracteres); { gap } = espaço
function janela(titulo, linhas, rotulo) {
  const W = 1200, x = 34, size = 18, lh = 28;
  let css = '', svg = '', t = 0.5, y = 82, i = 0;
  for (const l of linhas) {
    if (l.gap) { y += l.gap; continue; }
    if (l.cmd) {
      const d = digitar({ id: `k${i}`, x, y, size: 20, text: '$ ' + l.cmd, fill: C.g, start: t, dur: l.cmd.length * 0.04, bg: C.panel, cursor: true });
      css += d.css; svg += d.svg; t += l.cmd.length * 0.04 + 0.3; y += lh + 6;
    } else {
      css += `.l${i}{animation:fo .25s ${t.toFixed(2)}s both}`;
      const xx = x + (l.ind || 0) * cw(size);
      const partes = Array.isArray(l.t) ? l.t : [[l.t, l.c, l.b]];
      svg += `<text class="l${i}" x="${xx}" y="${y}" font-size="${size}" xml:space="preserve">${partes.map(([s, c, b]) => `<tspan fill="${c || C.tx}"${b ? ' font-weight="700"' : ''}>${esc(s)}</tspan>`).join('')}</text>`;
      t += 0.06; y += lh;
    }
    i++;
  }
  css += `.pr{animation:fo .01s ${t.toFixed(2)}s both}`;
  svg += `<g class="pr"><text x="${x}" y="${y + 6}" font-size="20" fill="${C.g}">$</text><rect class="blink" x="${x + 20}" y="${y - 11}" width="12" height="21" fill="${C.g}"/></g>`;
  const H = y + 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO}" role="img" aria-label="${esc(rotulo)}">
  <style>@keyframes blink{50%{opacity:0}}.blink{animation:blink 1s steps(1) infinite}@keyframes fo{from{opacity:0}to{opacity:1}}${css}${RM}</style>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="${C.panel}" stroke="${C.bd}" stroke-width="2"/>
  <rect x="1" y="1" width="${W - 2}" height="40" fill="#0d171b"/>
  <path d="M1,41 H${W - 1}" stroke="${C.bd}" stroke-width="2"/>
  <circle cx="26" cy="21" r="7" fill="${C.r}"/><circle cx="50" cy="21" r="7" fill="#ffbd2e"/><circle cx="74" cy="21" r="7" fill="${C.g}"/>
  <text x="${W / 2}" y="27" font-size="15" fill="${C.mut}" text-anchor="middle">${esc(titulo)}</text>
  ${svg}
  <path d="M${W - 1},${H - 30} v29 h-29" stroke="${C.g}" stroke-width="4" fill="none"/>
</svg>`;
}

const SOBRE = [
  { cmd: 'cat sobre.txt' },
  { t: [['Support & Hardware Technician', C.hi, true], [' com mais de cinco anos de experiência em', C.tx]] },
  { t: 'suporte técnico N1 e N2, redes LAN/WAN e VPN, firewall, servidores e Active Directory.' },
  { t: 'Formação em Análise e Desenvolvimento de Sistemas e cursos em cibersegurança, Python' },
  { t: 'e SQL Server. Valorizo a boa comunicação e o trabalho em equipa para manter' },
  { t: 'utilizadores e infraestruturas a funcionar com segurança.' },
];
const EXP = [['Elevar Global Lda.', 'ago 2026 – atualmente', [
  'Suporte técnico N1 e N2 a utilizadores, presencial e remotamente.',
  'Diagnóstico e resolução de problemas de hardware e software.',
  'Gestão e suporte de servidores e Active Directory.',
  'Configuração e manutenção de redes LAN/WAN e VPN, equipamentos de rede e firewall.',
  'Instalação e configuração de sistemas operativos, aplicações e postos de trabalho.']],
['Centralgest Software · Mealhada', 'jun 2025 – ago 2026', [
  'Suporte técnico N1 e N2 a utilizadores, presencial e remotamente.',
  'Diagnóstico e resolução de problemas de hardware e software.',
  'Instalação, configuração e suporte ao software Centralgest.',
  'Configuração e suporte de equipamentos e serviços de rede e firewall.',
  'Apoio na resolução de incidentes e na melhoria da estabilidade dos sistemas.']],
['Filosoft', 'mai 2024 – jun 2025', [
  'Suporte técnico N1 e N2 a utilizadores.',
  'Manutenção preventiva e corretiva de equipamentos e sistemas.',
  'Gestão e suporte de servidores e Active Directory.',
  'Configuração e manutenção de redes LAN/WAN e VPN, equipamentos de rede e firewall.',
  'Instalação e configuração de sistemas operativos, aplicações e postos de trabalho.']]];
const EXPERIENCIA = [{ cmd: 'cat experiencia.log' }];
EXP.forEach(([emp, data, itens], k) => {
  if (k) EXPERIENCIA.push({ gap: 14 });
  EXPERIENCIA.push({ t: [[`[${data}] `, C.c], ['▸ Support & Hardware Technician', C.g, true], [` @ ${emp}`, C.hi]] });
  itens.forEach((s) => EXPERIENCIA.push({ t: [['  └─ ', C.mut], [s, C.tx]] }));
});
const AREAS = [{ cmd: 'ls -l areas/' }];
[['suporte_tecnico', 'Apoio a utilizadores e incidentes de hardware, software e acessos'],
 ['redes', 'Gestão e manutenção de redes e da conectividade da infraestrutura'],
 ['ciberseguranca', 'Firewall (pfSense/Sophos), VPN, monitorização e boas práticas'],
 ['servidores', 'Windows Server, Active Directory e GPO; Linux (Debian/Ubuntu/CentOS)'],
 ['dados_e_sistemas', 'SQL Server e sistemas de gestão empresarial (ERP)']]
  .forEach(([m, d]) => AREAS.push({ t: [['drwxr-x--- ', C.mut], [m.padEnd(18), C.g, true], [d, C.tx]] }));

const txt = (ls) => ls.filter((l) => l.t).map((l) => (Array.isArray(l.t) ? l.t.map((p) => p[0]).join('') : l.t)).join(' ');
out('sobre.svg', janela('cat sobre.txt — caio@secure', SOBRE, txt(SOBRE)));
out('experiencia.svg', janela('cat experiencia.log — caio@secure', EXPERIENCIA, txt(EXPERIENCIA)));
out('areas.svg', janela('ls -l areas/ — caio@secure', AREAS, txt(AREAS)));

out('header.svg', header());
out('terminal.svg', terminal());
out('camada8.svg', camada8());
out('rodape.svg', rodape());
[['01', 'sobre'], ['02', 'experiência'], ['03', 'áreas_de_atuação'], ['04', 'skills'], ['05', 'criador_do_camada_8'], ['06', 'contacto'], ['07', 'atividade']]
  .forEach(([n, t]) => out(`h${n}.svg`, titulo(n, t)));
console.log('ok:', fs.readdirSync(path.join(raiz, 'assets')).join(', '));
