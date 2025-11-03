import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Wave1 = () => (
  <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-[260px] md:h-[325px] object-cover z-0" preserveAspectRatio="none">
    <path fill="#c41212" fillOpacity="1" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
    <path fill="#a10f0f" fillOpacity="0.8" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,176C672,171,768,117,864,112C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
  </svg>
);

const Wave2 = () => (
  <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-[260px] md:h-[325px] object-cover z-0" preserveAspectRatio="none">
    <path fill="#c41212" fillOpacity="1" d="M0,128L60,149.3C120,171,240,213,360,229.3C480,245,600,235,720,208C840,181,960,139,1080,117.3C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
    <path fill="#a10f0f" fillOpacity="0.8" d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,160C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
  </svg>
);

const Wave3 = () => (
  <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-[260px] md:h-[325px] object-cover z-0" preserveAspectRatio="none">
    <path fill="#c41212" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,245.3C384,267,480,277,576,256C672,235,768,181,864,176C960,171,1056,213,1152,229.3C1248,245,1344,235,1392,229.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
    <path fill="#a10f0f" fillOpacity="0.8" d="M0,96L48,117.3C96,139,192,181,288,186.7C384,192,480,160,576,144C672,128,768,128,864,149.3C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
  </svg>
);


const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 hover:text-red-600 transition-colors">
    <circle cx="12" cy="12" r="10" fill="none" />
    <polyline points="12 8 8 12 12 16" />
    <line x1="16" y1="12" x2="8" y2="12" />
  </svg>
);

import pessoa1 from "../../assets/pessoa1.svg";
import pessoa2 from "../../assets/pessoa2.svg";
import pessoa3 from "../../assets/pessoa3.svg";


const slides = [
  {
    title: "Bem-Vindo(a)",
    subtitle: "ao EspaçoSenai!",
    text: "Organize seus eventos, reuniões, treinamentos e atividades com praticidade e agilidade! Este é o primeiro site desenvolvido para facilitar a reserva dos espaços disponíveis na unidade do SENAI Suíço-Brasileira.",
    WaveComponent: Wave1,
    imageUrl: pessoa1,
    imageLayout: "md:order-last",
    textAlign: "text-center md:text-left",
    imageSize: "w-64 sm:w-80 md:w-96 lg:w-[420px]",
  },
  {
    title: "A importância",
    subtitle: "do uso do site",
    text: "Através da plataforma, é possível realizar reservas de salas, laboratórios, equipamentos e outros recursos de maneira simples e rápida. O uso do EspaçoSenai é uma solução que traz diversos benefícios para alunos, professores e colaboradores da instituição.",
    WaveComponent: Wave2,
    imageUrl: pessoa2,
    imageLayout: "md:order-first",
    textAlign: "text-center md:text-left",
    imageSize: "w-60 sm:w-72 md:w-80 lg:w-[380px]",
  },
  {
    title: "Principais",
    subtitle: "funcionalidades",
    text: "As reservas são feitas em poucos passos e pode acompanhá-las em um painel com as suas solicitações. O sistema também envia notificações, permite edições e oferece suporte completo para tirar dúvidas e garantir uma boa experiência.",
    WaveComponent: Wave3,
    imageUrl: pessoa3,
    imageLayout: "md:order-first",
    textAlign: "text-center md:text-left ",
    imageSize: "w-60 sm:w-72 md:w-80 lg:w-[380px]",
  },
];


function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const jaViu = localStorage.getItem("onboardingVisto");
    if (jaViu === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const nextSlide = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else skip();
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const skip = () => {
    localStorage.setItem("onboardingVisto", "true");
    navigate("/", { replace: true });
  };

  const { WaveComponent, imageUrl, title, subtitle, text, imageLayout, textAlign, imageSize } = slides[index];

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 relative flex flex-col font-sans">
      <WaveComponent />

      <main className="relative flex-grow flex flex-col justify-center items-center p-6 pt-12 md:pt-0">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-20 w-full">
            
            <div className={`w-full md:w-1/2 flex justify-center ${imageLayout}`}>
              <img src={imageUrl} alt="Ilustração do slide" className={`h-auto transition-all duration-500 ease-in-out ${imageSize}`} />
            </div>

            <div className={`w-full md:w-1/2 ${textAlign}`}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight lg:text-black">
                {title}
                <span
                  className="text-xl md:text-2xl font-normal block mt-1 
                             text-red-700 md:text-gray-700 lg:text-black"
                >
                  {subtitle}
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-black leading-relaxed max-w-md mx-auto md:mx-0">
                {text}
              </p>
            </div>

          </div>
        </div>
      </main>

      <footer className="relative p-6 z-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center mb-1">
            {slides.map((_, i) => (
              <span key={i} className={`w-3 h-3 mx-1.5 rounded-full transition-all duration-300 ${ i === index ? "bg-red-600 scale-125" : "bg-gray-300" }`}/>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="w-12 h-12">
              {index > 0 && (
                <button onClick={prevSlide} className="p-0 border-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full bg-transparent" aria-label="Voltar">
                  <BackArrowIcon />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto sm:mx-0">
              <button onClick={skip} className="order-2 sm:order-1 border-2 border-red-600 bg-white text-red-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-red-50 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 w-full">
                {index === slides.length - 1 ? "Avançar" : "Pular"}
              </button>
              {index < slides.length - 1 && (
                <button onClick={nextSlide} className="order-1 sm:order-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full">
                  Continuar
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Onboarding;
