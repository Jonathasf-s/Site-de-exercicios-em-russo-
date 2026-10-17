import { useState } from "react";
import "./App.css";
import dados from "./frases.json";
import Quiz from "./Quiz.jsx";

export default function App() {
  // Qual caso foi escolhido? null = ainda nenhum (mostra os botões)
  const [caso, setCaso] = useState(null);

  // Tela 1: os botões dos casos
  if (caso === null) {
    return (
      <main className="cartao">
        <h1>Traduza para o russo</h1>
        <p className="frase">Escolha um caso para praticar</p>

        <div className="casos">
          {/* Object.entries transforma o JSON em uma lista [chave, dados] */}
          {Object.entries(dados).map(([chave, info]) => (
            <button
              key={chave}
              className="botao-caso"
              onClick={() => setCaso(chave)}
            >
              <strong>{info.titulo}</strong>
              <span>{info.descricao}</span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // Tela 2: o exercício do caso escolhido
  return (
    <Quiz
      key={caso}
      info={dados[caso]}
      onVoltar={() => setCaso(null)}
    />
  );
}