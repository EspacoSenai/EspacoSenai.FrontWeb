import React from "react";
import { motion } from "framer-motion";

export default function Footer() {

  const goToLandingAndScroll = (hash) => {
    if (window.location.pathname === "/landing") {
      const section = document.querySelector(hash);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/landing${hash}`;
    }
  };

  return (
    <>
      <div className="relative z-10 w-full flex justify-center -mt-10 md:-mt-16">
        <div className="bg-[#757575] w-[92%] max-w-[700px] py-2 rounded-md mx-auto -mb-8
                       flex items-center justify-center dark:bg-white px-4 sm:px-6 text-center shadow-md gap-3 sm:gap-4">
          <a
            href="https://www.sp.senai.br/termos-de-uso-e-politica-de-privacidade"
            className="text-white dark:text-black text-xs hover:underline"
          >
            POLÍTICA DE PRIVACIDADE
          </a>

          <img
            src="src/assets/esquilo.svg"
            alt="Logo EspaçoSenai"
            className="w-10 sm:w-12 h-auto select-none"
          />

          <a
            href="https://www.sp.senai.br/termos-de-uso-e-politica-de-privacidade"
            className="text-white dark:text-black text-xs hover:underline"
          >
            TERMOS DE USO
          </a>
        </div>
      </div>

      <footer className="relative bg-black text-white pt-24 md:pt-32 lg:pt-28 overflow-hidden">
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
                href="https://www.instagram.com/senai.suico?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
              <a href="https://www.linkedin.com/school/senaisp-suico/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <img src="src/assets/linkedin.svg" alt="" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <div>
            <h4 className="font-regular text-base mb-4">NAVEGAÇÃO</h4>
            <ul className="space-y-2">
              <li>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goToLandingAndScroll("#espacoSenai")}
                  className="inline-block border-b border-white text-white hover:text-gray-300"
                >
                  O que é EspaçoSenai
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goToLandingAndScroll("#comoFunciona")}
                  className="inline-block border-b border-white text-white hover:text-gray-300"
                >
                  Como Funciona
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goToLandingAndScroll("#faq")}
                  className="inline-block border-b border-white text-white hover:text-gray-300"
                >
                  Perguntas Frequentes
                </motion.a>
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
