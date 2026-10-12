import { useState } from "react";

// Layout padrão do teclado russo (ЙЦУКЕН)
const LINHAS = [
  ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
  ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
  ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ё"],
];

// onTecla(texto): chamada quando o usuário clica numa letra ou espaço
// onApagar(): chamada ao clicar em apagar
export default function Teclado({ onTecla, onApagar, desativado }) {
  const [maiuscula, setMaiuscula] = useState(false);

  function clicarLetra(letra) {
    onTecla(maiuscula ? letra.toUpperCase() : letra);
    setMaiuscula(false); // volta para minúscula depois de cada letra
  }

  return (
    <div className="teclado" aria-label="Teclado russo">
      {LINHAS.map((linha, i) => (
        <div className="teclado-linha" key={i}>
          {linha.map((letra) => (
            <button
              type="button"
              key={letra}
              className="tecla"
              disabled={desativado}
              // evita que o campo de texto perca o foco ao clicar na tecla
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => clicarLetra(letra)}
            >
              {maiuscula ? letra.toUpperCase() : letra}
            </button>
          ))}
        </div>
      ))}

      <div className="teclado-linha">
        <button
          type="button"
          className={"tecla tecla-larga" + (maiuscula ? " ativa" : "")}
          disabled={desativado}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setMaiuscula((m) => !m)}
        >
          ⇧ Maiúscula
        </button>
        <button
          type="button"
          className="tecla tecla-espaco"
          disabled={desativado}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onTecla(" ")}
        >
          espaço
        </button>
        <button
          type="button"
          className="tecla tecla-larga"
          disabled={desativado}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onApagar}
        >
          ⌫ Apagar
        </button>
      </div>
    </div>
  );
}