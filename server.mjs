// Servidor mínimo: sirve la web (dist) y reenvía el chat a Gemini.
// La clave vive solo aquí (variable GEMINI_API_KEY), nunca llega al navegador.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(fileURLToPath(new URL(".", import.meta.url)), "dist");
const PORT = process.env.PORT || 4173;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const MAX_BYTES = 20_000;
const LIMIT_PER_MIN = 20;

const TIPOS = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon",
  ".json": "application/json", ".woff2": "font/woff2",
};

// Límite sencillo por IP para que nadie gaste la cuota.
const visitas = new Map();
function massaPeticions(ip) {
  const ara = Date.now();
  const llista = (visitas.get(ip) || []).filter((t) => ara - t < 60_000);
  llista.push(ara);
  visitas.set(ip, llista);
  return llista.length > LIMIT_PER_MIN;
}

function llegirCos(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const trossos = [];
    req.on("data", (c) => {
      total += c.length;
      if (total > MAX_BYTES) { reject(new Error("massa gran")); req.destroy(); return; }
      trossos.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(trossos).toString("utf8")));
    req.on("error", reject);
  });
}

async function xat(req, res) {
  const clau = process.env.GEMINI_API_KEY;
  const json = (codi, obj) => {
    res.writeHead(codi, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
  };
  if (!clau) return json(503, { error: "IA no configurada" });
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  if (massaPeticions(ip)) return json(429, { error: "Massa peticions" });
  let entrada;
  try { entrada = JSON.parse(await llegirCos(req)); } catch { return json(400, { error: "Petició no vàlida" }); }
  const sistema = entrada?.system;
  const conversa = entrada?.conversa;
  if (typeof sistema !== "string" || typeof conversa !== "string") return json(400, { error: "Petició no vàlida" });
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": clau },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sistema }] },
          contents: [{ parts: [{ text: conversa }] }],
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!r.ok) return json(502, { error: "Error de la IA" });
    const dades = await r.json();
    return json(200, { text: dades?.candidates?.[0]?.content?.parts?.[0]?.text || "" });
  } catch {
    return json(502, { error: "Error de la IA" });
  }
}

async function estatic(req, res) {
  const ruta = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  let fitxer = join(DIST, ruta || "index.html");
  if (!fitxer.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  try {
    const cos = await readFile(fitxer);
    res.writeHead(200, { "Content-Type": TIPOS[extname(fitxer)] || "application/octet-stream" });
    res.end(cos);
  } catch {
    try {
      const cos = await readFile(join(DIST, "index.html"));
      res.writeHead(200, { "Content-Type": TIPOS[".html"] });
      res.end(cos);
    } catch { res.writeHead(404); res.end("No trobat"); }
  }
}

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") return xat(req, res);
  if (req.method === "GET" || req.method === "HEAD") return estatic(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => console.log("Troquel a http://localhost:" + PORT));
