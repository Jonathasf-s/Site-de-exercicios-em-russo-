import { useState, useEffect } from "react";
import "./App.css";
import Teclado from "./Teclado.jsx";

export default function App() {
  // "Estado": valores que, quando mudam, atualizam a tela automaticamente
  const [frase, setFrase] = useState(null);         // frase atual {id, portugues}
  const [resposta, setResposta] = useState("");     // o que o usuário digitou
  const [resultado, setResultado] = useState(null); // {correto, respostaCerta}

  // Busca uma frase nova no servidor
  async function carregarFrase() {
    const r = await fetch("/api/frase");
    const dados = await r.json();
    setFrase(dados);
    setResposta("");
    setResultado(null);
  }

  // Roda uma vez quando a página abre
  useEffect(() => {
    carregarFrase();
  }, []);

  // Envia a resposta para conferir
  async function verificar(e) {
    e.preventDefault(); // não recarregar a página
    const r = await fetch("/api/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: frase.id, resposta }),
    });
    setResultado(await r.json());
  }

  if (!frase) return <p className="carregando">Carregando...</p>;

  return (
    <main className="cartao">
      <h1>Traduza para o russo</h1>
      <p className="frase">{frase.portugues}</p>

      <form onSubmit={verificar}>
        <input
          type="text"
          lang="ru"
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          placeholder="Напишите перевод..."
          disabled={resultado !== null}
          autoFocus
        />
        {resultado === null && <button type="submit">Verificar</button>}
      </form>
            <Teclado
        desativado={resultado !== null}
        onTecla={(t) => setResposta((r) => r + t)}
        onApagar={() => setResposta((r) => r.slice(0, -1))}
      />

      {resultado && (
        <div className={resultado.correto ? "ok" : "erro"}>
          {resultado.correto ? (
            <p>✅ Resposta certa!</p>
          ) : (
            <>
              <p>❌ Quase! A resposta correta é:</p>
              <p className="correta">{resultado.respostaCerta}</p>
            </>
          )}
          <button onClick={carregarFrase}>Próxima frase</button>
        </div>
      )}
    </main>
  );
}