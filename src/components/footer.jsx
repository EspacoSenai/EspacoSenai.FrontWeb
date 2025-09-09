import React from "react";

export default function Footer() {
  return (
    <>
      {/* Cartão superior (retângulo com logo e links) */}
      <div className="relative z-30 w-full flex justify-center">
        <div className="bg-[#757575] dark:bg-white mt-24 sm:mt-32 md:mt-40 w-[92%] max-w-[700px] h-16 rounded-md mx-auto -mb-8
                        flex items-center justify-center gap-8 px-6 text-center shadow-md">
          <a
            href="#"
            className="text-white dark:text-black text-xs hover:underline whitespace-nowrap"
          >
            POLÍTICA DE PRIVACIDADE
          </a>

          <img
            src="src/assets/EspacoSenai.svg"
            alt="Logo EspaçoSenai"
            className="w-[80px] h-auto select-none"
          />

          <a
            href="#"
            className="text-white dark:text-black text-xs hover:underline whitespace-nowrap"
          >
            TERMOS DE USO
          </a>
        </div>
      </div>

      {/* Rodapé principal */}
      <footer className="relative z-20 bg-black text-white pt-32 lg:pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-sm text-center md:text-left">
          {/* INFORMAÇÕES */}
          <div>
            <h4 className="font-regular text-base mb-3">INFORMAÇÕES</h4>
            <p className="text-[#ccc] mb-4 leading-relaxed">
              Este site permite que alunos e colaboradores reservem salas,
              laboratórios e outros ambientes disponíveis na unidade SENAI
              Suíço-Brasileira.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://www.instagram.com/_.vitinho07/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="src/assets/instagram.svg" alt="" className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/VitorAguiiar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <img src="src/assets/github.svg" alt="" className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <img src="src/assets/linkedin.svg" alt="" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <div>
            <h4 className="font-regular text-base mb-4">NAVEGAÇÃO</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#espacoSenai"
                  className="inline-block border-b border-white text-white hover:text-gray-300"
                >
                  O que é EspaçoSenai
                </a>
              </li>
              <li>
                <a
                  href="#comoFunciona"
                  className="inline-block border-b border-white text-white hover:text-gray-300"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="inline-block border-b border-white text-white hover:text-gray-300"
                >
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4 className="font-regular text-base mb-4">CONTATO</h4>
            <p className="text-[#ccc]">
              (11) 3322-0050 <br className="sm:hidden" />
              <span className="hidden sm:inline">(Telefone / WhatsApp)</span>
            </p>
          </div>
        </div>

        {/* Base arredondada */}
        <div className="w-full mt-12 md:mt-16 h-10 bg-[#D9D9D9] rounded-t-[100%] flex items-center justify-center text-[11px] sm:text-xs text-black px-4 text-center">
          <p>Copyright 2025 © Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
