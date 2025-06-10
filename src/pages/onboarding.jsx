import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Imagens de ondas
import onda1 from "../assets/ondas1.svg";
import onda2 from "../assets/ondas2.svg";
import onda3 from "../assets/ondas3.svg";

// Imagens de pessoas
import pessoa1 from "../assets/pessoa1.svg";
import pessoa2 from "../assets/pessoa2.svg";
import pessoa3 from "../assets/pessoa3.svg";

import voltarIcon from "../assets/voltar.svg";

const slides = [
  {
    title: "Bem-Vindo(a)",
    subtitle: "ao EspaçoSenai!",
    text: "Organize seus eventos, reuniões, treinamentos e atividades com praticidade e agilidade! Esse é o primeiro site desenvolvido para facilitar o reserva dos espaços disponíveis na unidade do SENAI Suíço-Brasileira.",
    onda: onda1,
    imagem: pessoa1,
    titleClass: "px-[130px] text-left",
    subtitleClass: "text-[20px] font-normal block mt-[-4px]",
    textClass: "mt-[75px]",
    layoutClass: "md:flex-row-reverse",
    imageClass: "-mt-6",
  },
  {
    title: "A importância",
    subtitle: "do uso do site",
    text: "Através da plataforma, é possível realizar reservas de salas, laboratórios, equipamentos e outros recursos de maneira simples e rápida. O uso do EspaçoSenai é uma solução que traz diversos benefícios para alunos, professores e colaboradores da instituição.",
    onda: onda2,
    imagem: pessoa2,
    titleClass: "px-[270px] text-left",
    subtitleClass: "text-[20px] font-normal block mt-[-4px]",
    textClass: "text-[30px] mt-[-50px]",
    layoutClass: "md:flex-row",
    imageClass: "-mt-6",
  },
  {
    title: "Principais",
    subtitle: "funcionalidades",
    text: "As reservas são feitas em poucos passos e você pode acompanhá-las tudo em um painel com suas solicitações. O sistema também envia notificações, permite edições e oferece suporte completo para tirar dúvidas e garantir uma boa experiência.",
    onda: onda3,
    imagem: pessoa3,
    titleClass: "px-[150px] text-left",
    subtitleClass: "text-[24px] font-normal block mt-[-4px]",
    textClass: "mt-[40px]",
    layoutClass: "md:flex-row",
    imageClass: "mt-[20px]",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      skip();
    }
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const skip = () => {
    navigate("/");
  };

  const {
    title,
    subtitle,
    text,
    onda,
    imagem,
    titleClass,
    subtitleClass,
    textClass,
    layoutClass,
    imageClass,
  } = slides[index];

  return (
    <div className="min-h-screen overflow-hidden bg-white relative flex flex-col font-sans">
      {/* Onda no topo */}
      <img
        src={onda}
        alt="Topo com ondas"
        className="absolute top-[-23px] left-0 w-full h-[325px] object-cover z-0"
      />

      {/* Título */}
      <div className={`pt-[10px] z-10 ${titleClass}`}>
        <h2 className="text-[32px] font-bold leading-snug text-gray-900">
          {title}
          <br />
          <span className={subtitleClass}>{subtitle}</span>
        </h2>
      </div>

      {/* Conteúdo */}
      <div
        className={`flex-1 flex flex-col ${layoutClass} items-center px-6 z-10 gap-6 ${
          index === 2 ? "pt-[60px]" : "pt-[100px]"
        }`}
      >
        {/* Ilustração */}
        <div
          className={`flex ml-16 px-16 justify-center md:justify-start w-full md:w-1/2 ${imageClass}`}
        >
          <img src={imagem} alt="Ilustração" className="w-[300px] h-auto" />
        </div>

        {/* Texto */}
        <div className={`w-full md:w-1/2 ${textClass}`}>
          <p className="text-[18px] text-gray-700 max-w-xl">{text}</p>
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center mt-6 z-10">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 mx-1 rounded-full ${
              i === index ? "bg-red-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Botões */}
      <div className="flex justify-between items-center px-6 pb-6 z-10">
        {index > 0 ? (
          <button
            onClick={prevSlide}
            className="p-0 border-none focus:outline-none focus:ring-0 bg-transparent"
          >
            <img src={voltarIcon} alt="Voltar" className="w-12 h-12" />
          </button>
        ) : (
          <span className="w-6" />
        )}

        <div className="flex gap-4 ml-auto">
          {index < slides.length - 1 && (
            <button
              onClick={nextSlide}
              className="bg-[#c41212] text-white px-6 py-2 rounded-lg font-medium"
            >
              Continuar
            </button>
          )}
          <button
            onClick={skip}
            className="border border-[#c41212] hover:border-[#c41212] bg-white text-black px-6 py-2 rounded-lg font-medium"
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  );
}
