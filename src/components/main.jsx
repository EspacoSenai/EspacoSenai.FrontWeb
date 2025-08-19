import React from 'react';

export default function Main() {
  return (
    <main className="bg-white dark:bg-[#0B0B0B] scroll-smooth">
      {/* Seção: O que é o EspaçoSenai? */}
      <img src="src/assets/ondaLandinpage.svg" alt="Onda landingpage" className="w-full" />

      <section id="espacoSenai" className="flex justify-between items-center py-12 px-6 md:px-12 relative z-10">
        <div className="max-w-xl pr-6">
        <div className="relative top-8 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full"></div>
          <h2 className="text-3xl pl-2 font-medium">
            <span className="text-black dark:text-white">O que é o </span>
            <span className="text-[#AE0000]">EspaçoSenai</span>
            <span className="text-black dark:text-white">?</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <br />
            Criado para facilitar a organização de atividades acadêmicas e administrativas, o sistema permite reservar salas, laboratórios, áreas de lazer e muito mais de forma prática e rápida.
            <br /><br />
            <span>Ele centraliza as informações, reduz burocracias e garante mais organização no dia a dia, tanto para quem utiliza os espaços quanto para quem os administra.</span>
            <br /> <br />
            <span>Precisa de um espaço para organizar a aula, fazer um projeto ou organizar um evento? Agora ficou fácil!</span>
          </p>
        </div>
        <img src="src/assets/mulher.svg" alt="Ilustração EspaçoSenai" className='top-12'/>
      </section>

      <div className="border-t-2 border-gray-300 dark:border-gray-600 mx-8 mt-[-50px]"></div>

      {/* Seção: Como Funciona */}
      <section id="comoFunciona" className="bg-white dark:bg-[#0B0B0B] py-12 px-6 md:px-12">
        <h2 className="text-[#AE0000] pl-2 text-3xl font-medium mb-9 relative">
          <div className="absolute top-1 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full"></div>
          Como <span className='text-black dark:text-white'> Funciona?</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center ">
          <div className="w-full md:w-1/3 text-center md:text-left mb-6 md:mb-0">
            <ol className="list-none pl-6 space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <li className="flex items-center space-x-3 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#AE0000] text-white font-bold text-sm z-[1]" >1</span>
                <span>Faça login com seu usuário SENAI</span>
                <div className="absolute left-1 transform -translate-x-1/2 top-2 w-px h-16 bg-[#C5C5C5] dark:bg-white z-[0]"></div>
              </li>
              <li className="flex items-center space-x-3 relative">
                <span className="flex items-center justify-center w-9 h-8 rounded-full bg-[#AE0000] text-white font-bold text-sm z-[1]">2</span>
                <span>Use os filtros para encontrar o espaço ideal</span>
                <div className="absolute left-1 transform -translate-x-1/2 top-4 w-px h-16 bg-[#C5C5C5] dark:bg-white z-[0]"></div>
              </li>
              <li className="flex items-center space-x-3 relative top-[-5px]">
                <span className="flex items-center justify-center w-10 h-8 rounded-full bg-[#AE0000] text-white font-bold text-sm z-[1]">3</span>
                <span>Consulte os horários disponíveis com facilidade</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="w-full text-center mt-8 relative z-50">
          <p className="text-2xl font-regular text-black dark:text-white mb-4">
            Aqui você terá a <span className="text-[#AE0000]">melhor</span> experiência!
          </p>
          <div className="flex justify-center gap-4">
            <span className="rounded-[8px] px-7 py-3 bg-white dark:bg-[#2a2a2a] border-2 border-[#AE0000] text-[#AE0000] text-left mr-10  dark:border-white dark:text-white  dark:hover:bg-black">
              Busca por <br />
              Espaços
            </span>
            <span className="rounded-[8px] px-6 py-3 bg-white dark:bg-[#2a2a2a] border-2 border-[#AE0000] text-[#AE0000] text-left mr-10  dark:border-white dark:text-white dark:border-white dark:text-white   dark:hover:bg-black">
              Horários <br />
              Disponíveis
            </span>
            <span className="rounded-[8px] px-6 py-3 bg-white dark:bg-[#2a2a2a] border-2 border-[#AE0000] text-[#AE0000] text-left dark:border-white dark:text-white dark:border-white dark:text-white dark:hover:bg-black">
              Ajuda e <br />
              Suporte
            </span>
          </div>
        </div>
      </section>

      {/* Linha Separadora */}
      <div className="border-t-2 border-gray-300 dark:border-gray-600 mx-8 mt-[0px] mb-3"></div>

      {/* Seção: Perguntas Frequentes */}
      <section id="faq" className="px-6 md:px-12 py-16 bg-white dark:bg-[#0B0B0B] relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 relative">
          <div className="absolute top-1 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full z-0"></div>
          <span className="pl-2 text-black font-medium dark:text-white">
            Perguntas <span className="text-[#AE0000]">Frequentes</span>
          </span>
        </h2>

        <div className="space-y-20 max-w-3xl">
          <div>
            <p className="border border-[#AE0000] text-black dark:border-white dark:text-white rounded-lg inline-block px-4 py-2 font-medium mb-2">
              Consigo cancelar ou editar uma reserva?
            </p>
            <p className="ml-2 border-b-4 text-black dark:text-white border-[#AE0000] pb-1">
              Sim! Você pode alterar ou cancelar suas reservas pelo próprio painel do usuário.
            </p>
          </div>
          <div>
            <p className="border border-[#AE0000] text-black dark:text-white dark:border-white rounded-lg inline-block px-4 py-2 font-medium mb-2">
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

        {/* Onda na section */}
        <img
          src="src/assets/ondaPrincipal.svg"
          alt="Onda rodapé"
          className="w-full h-auto object-cover absolute top-[-200px] right-0 z-0 "
        />
      </section>
    </main>
  );
}
