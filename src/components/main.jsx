import React from 'react';

export default function Main() {
  return (
    <main className="bg-white dark:bg-[#0B0B0B] scroll-smooth overflow-hidden relative">
      
      {/* Onda do topo (sempre visível) */}
      <img
        src="src/assets/ondaLandinpage.svg"
        alt="Onda landingpage"
        className="w-full h-auto object-cover"
      />

      {/* Seção: O que é o EspaçoSenai */}
      <section
        id="espacoSenai"
        className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 md:gap-12 py-12 px-6 md:px-12 relative z-20"
      >
        <div className="max-w-xl pr-0 md:pr-6">
          <div className="relative top-8 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full"></div>
          <h2 className="text-3xl pl-2 font-medium">
            <span className="text-black dark:text-white">O que é o </span>
            <span className="text-[#AE0000]">EspaçoSenai</span>
            <span className="text-black dark:text-white">?</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Criado para facilitar a organização de atividades acadêmicas e
            administrativas, o sistema permite reservar salas, laboratórios,
            áreas de lazer e muito mais de forma prática e rápida.
            <br />
            Ele centraliza as informações, reduz burocracias e garante mais
            organização no dia a dia, tanto para quem utiliza os espaços
            quanto para quem os administra.
            <br /> <br />
            Precisa de um espaço para organizar a aula, fazer um projeto ou
            organizar um evento? Agora ficou fácil!
          </p>
        </div>

        <img
          src="src/assets/mulher.svg"
          alt="Ilustração EspaçoSenai"
          className="top-12 w-full max-w-[420px] md:max-w-[480px] h-auto object-contain mx-auto md:mx-0 mt-8 md:mt-0"
        />
      </section>

      <div className="border-t-2 border-gray-300 dark:border-gray-600 mx-8 mt-[-50px]"></div>

      {/* Seção: Como Funciona — alinhada e responsiva */}
      <section
        id="comoFunciona"
        className="bg-white dark:bg-[#0B0B0B] py-12 px-6 md:px-12"
      >
        <h2 className="text-[#AE0000] pl-2 text-3xl font-medium mb-9 relative">
          <div className="absolute top-1 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full"></div>
          Como <span className="text-black dark:text-white"> Funciona?</span>
        </h2>

        <div className="w-full md:w-2/3 max-w-2xl">
          {/* Linha vertical única com borda; badges ficam centralizados sobre a linha */}
          <ol className="relative border-l border-[#C5C5C5] dark:border-white/80 pl-10 space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {/* Item 1 */}
            <li className="relative">
              <span className="absolute -left-4 md:-left-5 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#AE0000] text-white text-sm font-bold select-none">
                1
              </span>
              <p>Faça login com seu usuário SENAI</p>
            </li>

            {/* Item 2 */}
            <li className="relative">
              <span className="absolute -left-4 md:-left-5 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#AE0000] text-white text-sm font-bold select-none">
                2
              </span>
              <p>Use os filtros para encontrar o espaço ideal</p>
            </li>

            {/* Item 3 */}
            <li className="relative">
              <span className="absolute -left-4 md:-left-5 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#AE0000] text-white text-sm font-bold select-none">
                3
              </span>
              <p>Consulte os horários disponíveis com facilidade</p>
            </li>
          </ol>
        </div>

        <div className="w-full text-center mt-10 relative z-50">
          <p className="text-2xl font-regular text-black dark:text-white mb-4">
            Aqui você terá a <span className="text-[#AE0000]">melhor</span>{' '}
            experiência!
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <span className="rounded-[8px] px-7 py-3 bg-white dark:bg-[#2a2a2a] border-2 border-[#AE0000] text-[#AE0000] text-left md:mr-10 dark:border-white dark:text-white dark:hover:bg-black">
              Busca por <br />
              Espaços
            </span>
            <span className="rounded-[8px] px-6 py-3 bg-white dark:bg-[#2a2a2a] border-2 border-[#AE0000] text-[#AE0000] text-left md:mr-10 dark:border-white dark:text-white dark:hover:bg-black">
              Horários <br />
              Disponíveis
            </span>
            <span className="rounded-[8px] px-6 py-3 bg-white dark:bg-[#2a2a2a] border-2 border-[#AE0000] text-[#AE0000] text-left dark:border-white dark:text-white dark:hover:bg-black">
              Ajuda e <br />
              Suporte
            </span>
          </div>
        </div>
      </section>

      {/* Linha Separadora */}
      <div className="border-t-2 border-gray-300 dark:border-gray-600 mx-8 mt-[0px] mb-3"></div>

      {/* Seção: Perguntas Frequentes */}
      <section
        id="faq"
        className="
          px-6 md:px-12 pt-16
          bg-white dark:bg-[#0B0B0B] relative z-5
          max-1030:pb-28
          min-1031:pb-0
        "
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 relative">
          <div className="absolute top-1 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full z-0"></div>
          <span className="pl-2 text-black font-medium dark:text-white">
            Perguntas <span className="text-[#AE0000]">Frequentes</span>
          </span>
        </h2>

        <div className="space-y-10 md:space-y-12 max-w-3xl">
          <div>
            <p className="border border-[#AE0000] text-black dark:border-white dark:text-white rounded-lg inline-block px-4 py-2 font-medium mb-2">
              Consigo cancelar ou editar uma reserva?
            </p>
            <p className="ml-2 border-b-4 text-black dark:text-white border-[#AE0000] pb-1">
              Sim! Você pode alterar ou cancelar suas reservas pelo próprio painel do usuário.
            </p>
          </div>
          <div>
            <p className="border border-[#AE0000] text-black dark:border-white dark:text-white rounded-lg inline-block px-4 py-2 font-medium mb-2">
              E se eu tiver dúvidas?
            </p>
            <p className="ml-2 border-b-4 border-[#AE0000] text-black dark:text-white pb-1">
              Você pode acessar o suporte diretamente pelo sistema!
            </p>
          </div>
          <div>
            <p className="border border-[#AE0000] dark:border-white text-black dark:text-white rounded-lg inline-block px-4 py-2 font-medium mb-2">
              E se eu me esquecer da reserva?
            </p>
            <p className="ml-2 border-b-4 border-[#AE0000] text-black dark:text-white pb-1">
              Estará tudo bem! Pois temos um lembrete para sempre te relembrar.
            </p>
          </div>
        </div>
      </section>

      {/* Espaço extra só quando a onda estiver oculta (<=1030px) */}
      <div className="max-1030:block min-1031:hidden h-24" />

      {/* Onda do rodapé — só aparece acima de 1030px */}
      <div className="relative -z-2 min-1031:mt-[-700px] max-1030:mt-0 min-1031:block max-1030:hidden">
        <img
          src="src/assets/ondaPrincipal.svg"
          alt="Onda rodapé"
          className="w-full h-auto object-cover select-none"
        />
      </div>
    </main>
  );
}
