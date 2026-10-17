import { useState } from "react";
import Teclado from "./Teclado.jsx";

// Deixa o texto "comparável": minúsculas, sem pontuação, ё = е, espaços limpos
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[-–—]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Embaralha uma lista (sem mexer na original)
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// No celular, não abrir o teclado do sistema automaticamente
// (o aluno usa o teclado russo da tela)
const ehCelular = window.matchMedia("(pointer: coarse)").matches;

// info = { titulo, descricao, frases: [{pt, ru, alt?}] }
export default function Quiz({ info, onVoltar }) {
  const [frases, setFrases] = useState(() => embaralhar(info.frases));
  const [indice, setIndice] = useState(0);        // qual frase estamos
  const [resposta, setResposta] = useState("");   // o que o aluno digitou
  const [acertou, setAcertou] = useState(null);   // null = ainda não respondeu
  const [acertos, setAcertos] = useState(0);

  const terminou = indice >= frases.length;
  const atual = frases[indice];

  // Compara o que foi digitado com a resposta certa (e alternativas, se houver)
  function verificar(e) {
    e.preventDefault(); // não recarregar a página
    const aceitas = [atual.ru, ...(atual.alt ?? [])];
    const correto = aceitas.some((r) => normalizar(r) === normalizar(resposta));
    setAcertou(correto);
    if (correto) setAcertos((a) => a + 1);
  }

  function proxima() {
    setIndice((i) => i + 1);
    setResposta("");
    setAcertou(null);
  }

  function recomecar() {
    setFrases(embaralhar(info.frases));
    setIndice(0);
    setResposta("");
    setAcertou(null);
    setAcertos(0);
  }

  // Tela final
  if (terminou) {
    return (
      <main className="cartao fim">
        <h1>{info.titulo}</h1>
        <p className="frase">
          Você acertou {acertos} de {frases.length}
        </p>
        <div className="acoes">
          <button onClick={recomecar}>Praticar de novo</button>
          <button className="secundario" onClick={onVoltar}>
            Escolher outro caso
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cartao">
      <div className="topo">
        <button className="voltar" onClick={onVoltar}>
          ← Casos
        </button>
        <span className="progresso">
          {indice + 1} / {frases.length}
        </span>
      </div>

      <h1>{info.titulo}</h1>
      <p className="frase">{atual.pt}</p>

      <form onSubmit={verificar}>
        <input
          key={indice} /* recria o campo a cada frase para focar de novo */
          type="text"
          lang="ru"
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          placeholder="Напишите перевод..."
          disabled={acertou !== null}
          autoFocus={!ehCelular}
        />
        {acertou === null && <button type="submit">Verificar</button>}
      </form>

      <Teclado
        desativado={acertou !== null}
        onTecla={(t) => setResposta((r) => r + t)}
        onApagar={() => setResposta((r) => r.slice(0, -1))}
      />

      {acertou !== null && (
        <div className={acertou ? "ok" : "erro"}>
          {acertou ? (
            <p>✅ Resposta certa!</p>
          ) : (
            <>
              <p>❌ Quase! A resposta correta é:</p>
              <p className="correta">{atual.ru}</p>
            </>
          )}
          <button autoFocus onClick={proxima}>
            {indice + 1 === frases.length ? "Ver resultado" : "Próxima frase"}
          </button>
        </div>
      )}
    </main>
  );
}