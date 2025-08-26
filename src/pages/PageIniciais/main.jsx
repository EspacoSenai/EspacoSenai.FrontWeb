import React from 'react';

export default function Main() {
  return (
    <main className="bg-white dark:bg-[#0B0B0B] scroll-smooth">
      <img src="src/assets/ondaLandinpage.svg" alt="Onda landingpage" className="w-full" />

      <section id="espacoSenai" className="flex flex-col md:flex-row justify-between items-center py-12 px-6 md:px-12 relative z-10">
        <div className="max-w-xl pr-6">
          <div className="relative top-9 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full" />
          <h2 className="text-4xl font-medium">
            <span className="text-black dark:text-white">O que é o </span>
            <span className="text-[#AE0000]">EspaçoSenai</span>
            <span className="text-black dark:text-white">?</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Criado para facilitar a organização de atividades acadêmicas e administrativas, o sistema permite reservar salas, laboratórios, áreas de lazer e muito mais de forma prática e rápida.
            <br /><br />
            Ele centraliza as informações, reduz burocracias e garante mais organização no dia a dia.
          </p>
        </div>
        <img src="src/assets/mulher.svg" alt="Ilustração EspaçoSenai" className="mt-8 md:mt-0" />
      </section>

      <hr className="border-t-2 border-gray-300 dark:border-gray-600 mx-8 mt-[-50px]" />

      <section id="comoFunciona" className="py-12 px-6 md:px-12">
        <h2 className="text-[#AE0000] text-4xl font-medium mb-9 relative">
          <div className="absolute top-2 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full" />
          Como <span className="text-black dark:text-white"> Funciona?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#AE0000] text-white flex items-center justify-center">1</div>
              <div>
                <p className="font-medium">Login</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Acesse com seu usuário SENAI.</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#AE0000] text-white flex items-center justify-center">2</div>
              <div>
                <p className="font-medium">Busca</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Use filtros para encontrar o espaço ideal.</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#AE0000] text-white flex items-center justify-center">3</div>
              <div>
                <p className="font-medium">Reserva</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Consulte horários e confirme sua reserva.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-300 dark:border-gray-600 mx-8 mt-0 mb-3" />

      <section id="faq" className="px-6 md:px-12 py-16 bg-white dark:bg-[#0B0B0B] relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 relative">
          <div className="absolute top-2 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full z-0" />
          <span className="pl-2 text-black dark:text-white">Perguntas <span className="text-[#AE0000]">Frequentes</span></span>
        </h2>

        <div className="space-y-8 max-w-3xl">
          <div>
            <p className="font-medium">Consigo cancelar ou editar uma reserva?</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Sim! Você pode alterar ou cancelar suas reservas pelo painel do usuário.</p>
          </div>
          <div>
            <p className="font-medium">E se eu tiver dúvidas?</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Acesse o suporte disponível no sistema.</p>
          </div>
          <div>
            <p className="font-medium">E se eu me esquecer da reserva?</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Receba lembretes para não esquecer.</p>
          </div>
        </div>

        <img src="src/assets/ondaPrincipal.svg" alt="Onda rodapé" className="w-full h-auto object-cover absolute top-[-200px] right-0 z-0" />
      </section>
    </main>
  );
}
