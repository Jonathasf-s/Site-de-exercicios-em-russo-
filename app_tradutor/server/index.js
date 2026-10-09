import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

app.get("/api/frase", (req, res) => {
  const frase = db
    .prepare("SELECT id, portugues FROM frases ORDER BY RANDOM() LIMIT 1")
    .get();
  if (!frase) return res.status(404).json({ erro: "Nenhuma frase no banco." });
  res.json(frase);
});

app.post("/api/verificar", (req, res) => {
  const { id, resposta } = req.body;
  const frase = db.prepare("SELECT russo FROM frases WHERE id = ?").get(id);
  if (!frase) return res.status(404).json({ erro: "Frase não encontrada." });

  const correto = normalizar(resposta) === normalizar(frase.russo);
  res.json({ correto, respostaCerta: frase.russo });
});

app.listen(3001, () => console.log("Servidor rodando em http://localhost:3001"));