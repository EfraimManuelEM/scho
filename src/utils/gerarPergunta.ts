export type Pergunta = {
  id: number;
  pergunta: string;
  opcoes: string[];
  resposta: number; // índice correto
};

const perguntas: Pergunta[] = [
  {
    id: 1,
    pergunta: "Quem é o primeiro presidente de Angola?",
    opcoes: [
      "António Agostinho Neto",
      "Eduardo Dos Santos",
      "João Lourenço",
      "António Agostinho"
    ],
    resposta: 0,
  },
  {
    id: 2,
    pergunta: "Quanto é 7 x 8?",
    opcoes: ["42", "56", "48", "64"],
    resposta: 1,
  },
  {
    id: 3,
    pergunta: "A maior floresta de Angola?",
    opcoes: ["Mayombe", "Cervantes", "Machado de Assis", "Kafka"],
    resposta: 0,
  },
  {
    id: 4,
    pergunta: "Qual é o animal que representa Angola?",
    opcoes: ["Palanca Negra", "Leão", "Elefante", "Cabrito"],
    resposta: 0,
  },
  {
    id: 5,
    pergunta: "Qual é o maior oceano do mundo?",
    opcoes: ["Atlântico", "Índico", "Pacífico", "Ártico"],
    resposta: 2,
  },
  {
    id: 6,
    pergunta: "Qual é a montanha mais alta do mundo?",
    opcoes: ["Everest", "K2", "Kilimanjaro", "Mont Blanc"],
    resposta: 0,
  },
  {
    id: 7,
    pergunta: "Quem pintou A Última Ceia?",
    opcoes: ["Leonardo da Vinci", "Picasso", "Michelangelo", "Van Gogh"],
    resposta: 0,
  },
  {
    id: 8,
    pergunta: "Quantos continentes existem?",
    opcoes: ["5", "6", "7", "8"],
    resposta: 2,
  },
  {
    id: 9,
    pergunta: "Qual é o símbolo químico do ouro?",
    opcoes: ["Au", "Ag", "O", "Fe"],
    resposta: 0,
  },
  {
    id: 10,
    pergunta: "Qual é o menor planeta do sistema solar?",
    opcoes: ["Mercúrio", "Marte", "Plutão", "Vênus"],
    resposta: 0,
  },
];

export function gerarPerguntasAleatorias(qtd: number) {
  return [...perguntas]
    .sort(() => Math.random() - 0.5)
    .slice(0, qtd);
}
