import { readFileSync } from "node:fs";
import db from "./db.js";

// Lê o arquivo frases.txt e coloca as frases novas no banco.
// Formato de cada linha:  português | russo
// Linhas vazias e linhas que começam com # são ignoradas.
const texto = readFileSync("frases.txt", "utf-8").replace(/^\uFEFF/, "");
const linhas = texto.split(/\r?\n/);

const buscar = db.prepare("SELECT id, russo FROM frases WHERE portugues = ?");
const inserir = db.prepare("INSERT INTO frases (portugues, russo) VALUES (?, ?)");
const atualizar = db.prepare("UPDATE frases SET russo = ? WHERE id = ?");

const vistas = new Set();
let novas = 0, atualizadas = 0, iguais = 0, erros = 0;

linhas.forEach((linha, i) => {
  const t = linha.trim();
  if (!t || t.startsWith("#")) return;

  const partes = t.split("|").map((p) => p.trim());
  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    console.log(`Linha ${i + 1} ignorada (use: português | russo): ${t}`);
    erros++;
    return;
  }

  const [pt, ru] = partes;
  if (vistas.has(pt)) {
    console.log(`Linha ${i + 1} ignorada (frase repetida no arquivo): ${pt}`);
    erros++;
    return;
  }
  vistas.add(pt);

  const existente = buscar.get(pt);
  if (!existente) {
    inserir.run(pt, ru);
    novas++;
  } else if (existente.russo !== ru) {
    atualizar.run(ru, existente.id); // corrige a tradução de uma frase que já existia
    atualizadas++;
  } else {
    iguais++;
  }
});

const { total } = db.prepare("SELECT COUNT(*) AS total FROM frases").get();
console.log(`Novas: ${novas} | Corrigidas: ${atualizadas} | Já existiam: ${iguais} | Com erro: ${erros}`);
console.log(`Total de frases no banco: ${total}`);