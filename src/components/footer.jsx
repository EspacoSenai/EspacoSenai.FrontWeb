import React from 'react';

export default function Footer() {
  return (
    <>
      {/* Retângulo branco superior com logo e links */}
      <div className="bg-[#757575] dark:bg-[#FFFFFF] mt-[230px] w-[90%] max-w-[650px] h-16 rounded-md mx-auto -mb-8 relative z-20 flex justify-center items-center gap-6 px-6">
        <a href="#" className="text-white text-xs hover:underline hover:text-white dark:text-black">POLÍTICA DE PRIVACIDADE</a>
        <img src="src/assets/EspacoSenai.svg" alt="Logo EspaçoSenai" className="w-[80px]" />
        <a href="#" className="text-white text-xs hover:underline hover:text-white dark:text-black">TERMOS DE USO</a>
      </div>

      {/* Rodapé principal */}
      <footer className="bg-black text-white pt-32 lg:pt-28 relative z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

          {/* INFORMAÇÕES */}
          <div>
            <h4 className="font-semibold text-base mb-3">INFORMAÇÕES</h4>
            <p className="text-[#ccc] mb-4">
              Este site permite que alunos e colaboradores reservem salas, laboratórios e outros ambientes disponíveis na unidade SENAI Suíço-Brasileira.
            </p>
            <div className="flex gap-4">
              <img src="src/assets/instagram.svg" alt="Instagram" className="w-5 h-5" />
              <img src="src/assets/github.svg" alt="GitHub" className="w-5 h-5" />
              <img src="src/assets/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <div>
            <h4 className="font-semibold text-base mb-4">NAVEGAÇÃO</h4>
            <ul className="space-y-2">
              <li><a href="#espacoSenai" className="text-white border-b border-white hover:text-gray-300">O que é EspaçoSenai</a></li>
              <li><a href="#comoFunciona" className="text-white border-b border-white hover:text-gray-300">Como Funciona</a></li>
              <li><a href="#faq" className="text-white border-b border-white hover:text-gray-300">Perguntas Frequentes</a></li>
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4 className="font-semibold text-base mb-4">CONTATO</h4>
            <p className="text-[#ccc]">(11) 3322-0050 (Telefone / WhatsApp)</p>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="w-full mt-16 h-8 bg-[#D9D9D9] rounded-t-[100%] flex items-center justify-center text-xs text-black">
          <p>Copyright 2025 © Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
