import fs from "node:fs";
import path from "node:path";

const root = path.resolve("..");
const outDir = path.resolve("slides");
const W = 1600;
const H = 900;

const assets = {
  logo: dataUri(path.join(root, "assets", "hazo-logo.png")),
  hero: dataUri(path.join(root, "assets", "hero-auto.png")),
  team: dataUri(path.join(root, "assets", "about-team.png")),
  finance: dataUri(path.join(root, "assets", "finance-consortium.png")),
};

const colors = {
  blue: "#00AEEF",
  blueDark: "#0077B6",
  ink: "#26323D",
  slate: "#526271",
  dark: "#1C2B34",
  paper: "#FFFFFF",
  soft: "#F3F7FA",
  line: "#DCE8EF",
  green: "#35B884",
};

const slides = [
  {
    file: "01-capa.svg",
    title: "Proposta de Redesign Digital",
    subtitle: "Hazo Corretora de Seguros",
    kicker: "SITE COMERCIAL MODERNO",
    image: "hero",
    layout: "cover",
  },
  {
    file: "02-objetivo.svg",
    kicker: "OBJETIVO",
    title: "Transformar o site em uma experiência comercial clara.",
    body: "O novo site precisa explicar, gerar confiança e levar o visitante para a cotação com menos atrito.",
    layout: "objective",
    cards: [
      ["01", "Clareza", "Organizar a mensagem para o cliente entender seguros sem linguagem técnica."],
      ["02", "Conversão", "Dar destaque para WhatsApp, simulações e formulários por produto."],
      ["03", "Confiança", "Reforçar atendimento humano, transparência e presença local."],
    ],
  },
  {
    file: "03-diagnostico.svg",
    kicker: "DIAGNÓSTICO",
    title: "O conteúdo já existe. A oportunidade está na hierarquia.",
    body: "A versão atual comunica serviços importantes, mas a experiência visual ainda parece institucional e pouco orientada a venda.",
    layout: "diagnosis",
    points: [
      "Logo e navegação precisam ter presença mais precisa.",
      "Serviços devem virar rotas claras, não apenas blocos de texto.",
      "Financiamento e consórcio precisam de formulários dedicados.",
      "Blog e trabalhe conosco entram no ecossistema sem competir com conversão.",
    ],
  },
  {
    file: "04-arquitetura.svg",
    kicker: "ARQUITETURA",
    title: "Um site completo, com páginas pensadas por intenção.",
    layout: "sitemap",
    nodes: [
      ["Home", "Promessa clara, CTAs e visão geral"],
      ["Quem somos", "Confiança, história e diferenciais"],
      ["Seguros", "Auto, residencial, vida, caminhão, empresarial e viagem"],
      ["Financiamentos", "Formulário profissional para simulação"],
      ["Consórcios", "Imóvel, automóvel e tipos de lance"],
      ["Blog", "Conteúdo de suporte e SEO"],
    ],
  },
  {
    file: "05-identidade.svg",
    kicker: "SISTEMA VISUAL",
    title: "A identidade Hazo ganha uma leitura mais premium e limpa.",
    body: "O azul segue como cor de ação. O grafite organiza texto e confiança. As imagens ficam comerciais, luminosas e sem cortes acidentais.",
    layout: "identity",
  },
  {
    file: "06-paginas.svg",
    kicker: "PÁGINAS-CHAVE",
    title: "Cada página trabalha uma decisão do cliente.",
    layout: "pages",
    cards: [
      ["Home", "Entrada comercial e resumo das soluções."],
      ["Quem somos", "Credibilidade, missão e atendimento."],
      ["Seguros", "Texto completo e produtos organizados."],
      ["Financiamento", "Simulação com dados do veículo."],
      ["Consórcios", "Planos, vantagens e formulário."],
      ["Blog", "Conteúdo institucional e educativo."],
    ],
  },
  {
    file: "07-conversao.svg",
    kicker: "CONVERSÃO",
    title: "O WhatsApp vira o fluxo central de atendimento.",
    body: "Os formulários montam a mensagem automaticamente, reduzindo esforço para o cliente e levando dados mais úteis para a equipe.",
    layout: "conversion",
    image: "finance",
  },
  {
    file: "08-proximos-passos.svg",
    kicker: "PRÓXIMOS PASSOS",
    title: "Com a direção aprovada, o projeto entra em refinamento e publicação.",
    layout: "next",
    steps: [
      "Validar textos finais e ordem das páginas.",
      "Substituir fotos fictícias por imagens oficiais, se houver.",
      "Revisar formulários, WhatsApp e dados de contato.",
      "Publicar em hospedagem e configurar domínio/SEO.",
    ],
  },
];

fs.mkdirSync(outDir, { recursive: true });
for (const slide of slides) {
  fs.writeFileSync(path.join(outDir, slide.file), renderSlide(slide), "utf8");
}
fs.writeFileSync("index.html", renderPreview(), "utf8");
fs.writeFileSync("README.md", renderReadme(), "utf8");

function dataUri(file) {
  const ext = path.extname(file).toLowerCase().replace(".", "");
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
}

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textLines(text, max = 30) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function tspanBlock(text, x, y, size, color, weight = 500, max = 34, lineHeight = 1.18) {
  const lines = textLines(text, max);
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="Inter, Arial, sans-serif" font-weight="${weight}">
${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineHeight}">${esc(line)}</tspan>`).join("\n")}
</text>`;
}

function shell(slide) {
  return `
<rect width="${W}" height="${H}" fill="${colors.paper}"/>
<polygon points="0,0 560,0 350,900 0,900" fill="${colors.soft}"/>
<polygon points="1160,0 1600,0 1600,900 1380,900" fill="#E8F8FE"/>
<image href="${assets.logo}" x="72" y="54" width="250" height="112"/>
<text x="72" y="830" fill="${colors.slate}" font-size="20" font-family="Inter, Arial, sans-serif" font-weight="700">HAZO Corretora de Seguros · Proposta de Redesign</text>
<text x="1420" y="830" fill="${colors.slate}" font-size="20" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.file.slice(0, 2))}/08</text>`;
}

function kicker(text, x, y, dark = false) {
  return `<text x="${x}" y="${y}" fill="${dark ? "#84DFFF" : colors.blueDark}" font-size="20" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(text)}</text>`;
}

function renderSlide(slide) {
  if (slide.layout === "cover") return svg(`
    <rect width="${W}" height="${H}" fill="${colors.paper}"/>
    <image href="${assets.hero}" x="610" y="0" width="990" height="900" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${W}" height="${H}" fill="url(#coverShade)"/>
    <polygon points="0,0 710,0 490,900 0,900" fill="#FFFFFF" opacity="0.94"/>
    <polygon points="750,520 1600,210 1600,390 760,704" fill="${colors.blue}" opacity="0.9"/>
    <image href="${assets.logo}" x="80" y="70" width="292" height="132"/>
    ${kicker(slide.kicker, 84, 246)}
    ${tspanBlock(slide.title, 80, 340, 78, colors.ink, 900, 23, 1.04)}
    <text x="84" y="650" fill="${colors.slate}" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="700">${esc(slide.subtitle)}</text>
    <rect x="84" y="708" width="396" height="64" rx="8" fill="${colors.blue}"/>
    <text x="122" y="750" fill="#FFFFFF" font-size="22" font-family="Inter, Arial, sans-serif" font-weight="900">Apresentação do projeto</text>
  `, true);

  if (slide.layout === "objective") return svg(`
    ${shell(slide)}
    ${kicker(slide.kicker, 96, 210)}
    ${tspanBlock(slide.title, 92, 300, 62, colors.ink, 900, 18, 1.05)}
    ${tspanBlock(slide.body, 96, 520, 28, colors.slate, 500, 52, 1.35)}
    ${slide.cards.map((card, i) => cardSvg(780, 190 + i * 170, 650, 128, card[0], card[1], card[2])).join("\n")}
  `);

  if (slide.layout === "diagnosis") return svg(`
    ${shell(slide)}
    ${kicker(slide.kicker, 96, 190)}
    ${tspanBlock(slide.title, 92, 280, 60, colors.ink, 900, 19, 1.05)}
    ${tspanBlock(slide.body, 96, 575, 27, colors.slate, 500, 49, 1.34)}
    <rect x="820" y="170" width="620" height="560" rx="8" fill="${colors.dark}"/>
    ${slide.points.map((point, i) => `
      <circle cx="876" cy="${245 + i * 112}" r="12" fill="${colors.blue}"/>
      ${tspanBlock(point, 914, 254 + i * 112, 25, "#FFFFFF", 750, 39, 1.22)}
      ${i < slide.points.length - 1 ? `<line x1="876" y1="${270 + i * 112}" x2="876" y2="${328 + i * 112}" stroke="rgba(255,255,255,.25)" stroke-width="2"/>` : ""}
    `).join("")}
  `);

  if (slide.layout === "sitemap") return svg(`
    ${shell(slide)}
    ${kicker(slide.kicker, 96, 190)}
    ${tspanBlock(slide.title, 92, 280, 60, colors.ink, 900, 22, 1.05)}
    <line x1="820" y1="240" x2="820" y2="694" stroke="${colors.blue}" stroke-width="4"/>
    ${slide.nodes.map((node, i) => {
      const y = 206 + i * 82;
      return `<circle cx="820" cy="${y + 34}" r="13" fill="${colors.blue}"/>
      <rect x="870" y="${y}" width="530" height="68" rx="8" fill="#FFFFFF" stroke="${colors.line}"/>
      <text x="900" y="${y + 30}" fill="${colors.ink}" font-size="24" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(node[0])}</text>
      <text x="900" y="${y + 54}" fill="${colors.slate}" font-size="17" font-family="Inter, Arial, sans-serif" font-weight="600">${esc(node[1])}</text>`;
    }).join("\n")}
  `);

  if (slide.layout === "identity") return svg(`
    ${shell(slide)}
    ${kicker(slide.kicker, 96, 182)}
    ${tspanBlock(slide.title, 92, 272, 58, colors.ink, 900, 23, 1.04)}
    ${tspanBlock(slide.body, 96, 488, 27, colors.slate, 500, 48, 1.35)}
    <rect x="825" y="170" width="560" height="190" rx="8" fill="#FFFFFF" stroke="${colors.line}"/>
    <image href="${assets.logo}" x="875" y="206" width="280" height="126"/>
    <text x="1190" y="250" fill="${colors.slate}" font-size="22" font-family="Inter, Arial, sans-serif" font-weight="700">Logo oficial</text>
    <text x="1190" y="286" fill="${colors.blueDark}" font-size="20" font-family="Inter, Arial, sans-serif" font-weight="900">usado como imagem real</text>
    ${palette(825, 420, colors.blue, "Azul ação")}
    ${palette(1015, 420, colors.ink, "Grafite confiança")}
    ${palette(1205, 420, "#F3F7FA", "Base limpa", colors.ink)}
    <image href="${assets.team}" x="825" y="560" width="560" height="190" preserveAspectRatio="xMidYMid slice"/>
  `);

  if (slide.layout === "pages") return svg(`
    ${shell(slide)}
    ${kicker(slide.kicker, 96, 178)}
    ${tspanBlock(slide.title, 92, 268, 60, colors.ink, 900, 23, 1.05)}
    <g transform="translate(760 166)">
      ${slide.cards.map((card, i) => {
        const x = (i % 2) * 340;
        const y = Math.floor(i / 2) * 172;
        return miniPage(x, y, card[0], card[1], i + 1);
      }).join("\n")}
    </g>
  `);

  if (slide.layout === "conversion") return svg(`
    <rect width="${W}" height="${H}" fill="${colors.dark}"/>
    <polygon points="0,0 650,0 420,900 0,900" fill="${colors.blue}" opacity="0.95"/>
    <image href="${assets.finance}" x="850" y="150" width="560" height="340" preserveAspectRatio="xMidYMid slice"/>
    <image href="${assets.logo}" x="80" y="58" width="250" height="112"/>
    ${kicker(slide.kicker, 96, 218, true)}
    ${tspanBlock(slide.title, 92, 310, 60, "#FFFFFF", 900, 31, 1.05)}
    ${tspanBlock(slide.body, 96, 545, 27, "rgba(255,255,255,.82)", 500, 42, 1.35)}
    <rect x="850" y="550" width="560" height="170" rx="8" fill="#FFFFFF"/>
    <text x="890" y="610" fill="${colors.ink}" font-size="30" font-family="Inter, Arial, sans-serif" font-weight="900">Formulário → WhatsApp</text>
    <text x="890" y="658" fill="${colors.slate}" font-size="23" font-family="Inter, Arial, sans-serif" font-weight="600">dados organizados para atendimento</text>
    <rect x="890" y="684" width="220" height="44" rx="8" fill="${colors.green}"/>
    <text x="932" y="713" fill="#FFFFFF" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="900">Mensagem pronta</text>
  `);

  if (slide.layout === "next") return svg(`
    ${shell(slide)}
    ${kicker(slide.kicker, 96, 190)}
    ${tspanBlock(slide.title, 92, 280, 58, colors.ink, 900, 23, 1.05)}
    <g transform="translate(820 170)">
      ${slide.steps.map((step, i) => `
        <rect x="0" y="${i * 132}" width="590" height="100" rx="8" fill="${i === 0 ? colors.dark : "#FFFFFF"}" stroke="${i === 0 ? colors.dark : colors.line}"/>
        <text x="34" y="${i * 132 + 42}" fill="${i === 0 ? "#84DFFF" : colors.blueDark}" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="950">0${i + 1}</text>
        ${tspanBlock(step, 92, i * 132 + 48, 25, i === 0 ? "#FFFFFF" : colors.ink, 750, 34, 1.25)}
      `).join("")}
    </g>
    <rect x="96" y="650" width="390" height="70" rx="8" fill="${colors.blue}"/>
    <text x="132" y="694" fill="#FFFFFF" font-size="22" font-family="Inter, Arial, sans-serif" font-weight="900">Aprovar direção visual</text>
  `);
}

function svg(content, cover = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="coverShade" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0%" stop-color="#FFFFFF"/>
    <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.92"/>
    <stop offset="72%" stop-color="#FFFFFF" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="roundClip"><rect x="825" y="560" width="560" height="190" rx="8"/></clipPath>
</defs>
${content}
</svg>`;
}

function cardSvg(x, y, w, h, n, title, body) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#FFFFFF" stroke="${colors.line}"/>
  <text x="${x + 30}" y="${y + 45}" fill="${colors.blueDark}" font-size="21" font-family="Inter, Arial, sans-serif" font-weight="950">${esc(n)}</text>
  <text x="${x + 94}" y="${y + 45}" fill="${colors.ink}" font-size="29" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(title)}</text>
  ${tspanBlock(body, x + 94, y + 82, 20, colors.slate, 600, 48, 1.25)}`;
}

function palette(x, y, color, label, textColor = "#FFFFFF") {
  return `<rect x="${x}" y="${y}" width="160" height="92" rx="8" fill="${color}" stroke="${colors.line}"/>
  <text x="${x + 18}" y="${y + 55}" fill="${textColor}" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(label)}</text>`;
}

function miniPage(x, y, title, body, index) {
  return `<rect x="${x}" y="${y}" width="300" height="132" rx="8" fill="#FFFFFF" stroke="${colors.line}"/>
  <rect x="${x}" y="${y}" width="300" height="16" rx="8" fill="${index === 1 ? colors.dark : colors.blue}"/>
  <text x="${x + 24}" y="${y + 54}" fill="${colors.blueDark}" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="950">0${index}</text>
  <text x="${x + 24}" y="${y + 84}" fill="${colors.ink}" font-size="25" font-family="Inter, Arial, sans-serif" font-weight="900">${esc(title)}</text>
  ${tspanBlock(body, x + 24, y + 112, 16, colors.slate, 600, 31, 1.18)}`;
}

function renderPreview() {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hazo · Apresentação Figma</title>
    <style>
      body { margin: 0; background: #101820; color: white; font-family: Inter, Arial, sans-serif; }
      header { padding: 28px 36px; position: sticky; top: 0; background: rgba(16,24,32,.92); backdrop-filter: blur(14px); z-index: 2; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 0; color: rgba(255,255,255,.7); }
      main { display: grid; gap: 28px; padding: 28px; }
      figure { margin: 0 auto; width: min(1120px, 100%); }
      img { width: 100%; display: block; border-radius: 10px; box-shadow: 0 24px 90px rgba(0,0,0,.35); background: white; }
      figcaption { padding: 10px 4px 0; color: rgba(255,255,255,.65); font-weight: 700; }
    </style>
  </head>
  <body>
    <header><h1>Hazo · Modelo de apresentação para Figma</h1><p>Importe os SVGs da pasta slides no Figma como frames 16:9.</p></header>
    <main>
      ${slides.map((slide, i) => `<figure><img src="slides/${slide.file}" alt="Slide ${i + 1}"><figcaption>${String(i + 1).padStart(2, "0")} · ${esc(slide.title || slide.kicker)}</figcaption></figure>`).join("\n")}
    </main>
  </body>
</html>`;
}

function renderReadme() {
  return `# Hazo · Apresentação para Figma

Este kit contém 8 slides 16:9 em SVG, com visual profissional para apresentar o redesign do site da Hazo Corretora.

## Como usar no Figma

1. Abra o Figma.
2. Crie um arquivo novo.
3. Arraste todos os arquivos da pasta \`slides\` para a tela.
4. Organize os frames em sequência horizontal.
5. Ajuste textos, cores e imagens conforme necessário.

Os SVGs usam imagens embutidas em base64, então o logo e as fotos não se perdem ao importar.

## Preview

Abra \`index.html\` no navegador para revisar a apresentação antes de importar.

## Slides

1. Capa
2. Objetivo
3. Diagnóstico
4. Arquitetura do site
5. Sistema visual
6. Páginas-chave
7. Conversão
8. Próximos passos
`;
}
