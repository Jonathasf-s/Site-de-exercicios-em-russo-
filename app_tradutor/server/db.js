import { DatabaseSync } from "node:sqlite";

// Se você já tem seu .db, copie para a pasta app_tradutor e troque o nome aqui
const db = new DatabaseSync ("frases.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS frases (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    portugues TEXT NOT NULL,
    russo     TEXT NOT NULL
  )
`);

const { n } = db.prepare("SELECT COUNT(*) AS n FROM frases").get();
if (n === 0) {
  const inserir = db.prepare("INSERT INTO frases (portugues, russo) VALUES (?, ?)");
  const exemplos = [
    ["Bom dia!", "Доброе утро!"],
    ["Eu moro no Brasil.", "Я живу в Бразилии."],
    ["Como você está?", "Как ты?"],
    ["Eu gosto de café.", "Я люблю кофе."],
    ["Onde fica o banheiro?", "Где туалет?"],
    ["Muito obrigado.", "Большое спасибо."],
  ];
  for (const [pt, ru] of exemplos) inserir.run(pt, ru);
}

export default db;