import React from 'react';

export default function Main() {
  return (
    <main className="bg-white scroll-smooth overflow-hidden relative">
      
      <img
        src="src/assets/ondaLandinpage.svg"
        alt="Onda landingpage"
        className="w-full h-auto object-cover"  
      />

      <section
        id="espacoSenai"
        className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 md:gap-12 py-12 px-6 md:px-12 relative"
      >
        <div className="max-w-xl pr-0 md:pr-6">
          <div className="relative top-8 left-[-10px] w-1 h-7 bg-[#AE0000] rounded-full"></div>
          <h2 className="text-3xl pl-2 font-medium">
            <span className="text-black">O que é o </span>
            <span className="text-[#AE0000]">EspaçoSenai</span>
            <span className="text-black">?</span>
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
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

      <div className="border-t-2 border-gray-300 mx-8 mt-[-50px]"></div>

      <section
        id="comoFunciona"
        className="bg-white py-12 px-6 md:px-12"
      >
        <h2 className="text-3xl font-medium mb-9 flex items-center">
          <span className="inline-block w-1 h-7 bg-[#AE0000] rounded-full mr-2"></span>
          <span className="text-[#AE0000]">Como</span>
          <span className="text-black ml-2">Funciona?</span>
        </h2>

        <div className="w-full md:w-2/3 max-w-2xl">
          <div className="relative ml-6">
          
            <ol className="space-y-8 text-gray-700">

              
              <li className="relative flex items-start gap-4">
                <div className="absolute top-8 left-4 w-px bg-[#C5C5C5] h-[calc(100%+2rem)]"></div>
                <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#AE0000] text-white text-sm font-bold ring-8 ring-white z-10">
                  1
                </span>
                <p className="m-0 text-lg leading-relaxed">Faça login com seu usuário SENAI</p>
              </li>

              
              <li className="relative flex items-start gap-4">
                <div className="absolute top-8 left-4 w-px bg-[#C5C5C5] h-[calc(100%+2rem)]"></div>
                <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#AE0000] text-white text-sm font-bold ring-8 ring-white z-10">
                  2
                </span>
                <p className="m-0 text-lg leading-relaxed">Use os filtros para encontrar o espaço ideal</p>
              </li>

             
              <li className="relative flex items-start gap-4">
                <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#AE0000] text-white text-sm font-bold ring-8 ring-white z-10">
                  3
                </span>
                <p className="m-0 text-lg leading-relaxed">Consulte os horários disponíveis com facilidade</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-2xl text-black mb-6">
            Aqui você terá a <span className="text-[#AE0000]">melhor</span> experiência!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="rounded-[8px] px-7 py-3 bg-white border-2 border-[#AE0000] text-[#AE0000]">
              Busca por <br /> Espaços
            </span>
            <span className="rounded-[8px] px-7 py-3 bg-white border-2 border-[#AE0000] text-[#AE0000]">
              Horários <br /> Disponíveis
            </span>
            <span className="rounded-[8px] px-7 py-3 bg-white border-2 border-[#AE0000] text-[#AE0000]">
              Ajuda e <br /> Suporte
            </span>
          </div>
        </div>
      </section>

      <div className="border-t-2 border-gray-300 mx-8 mt-[0px] mb-3"></div>

      <section
        id="faq"
        className="px-6 md:px-12 pt-16 bg-white relative max-1030:pb-28 min-1031:pb-0"
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
          <span className="inline-block w-1 h-7 bg-[#AE0000] rounded-full mr-2"></span>
          <span className="pl-1 text-black font-medium">
            Perguntas <span className="text-[#AE0000]">Frequentes</span>
          </span>
        </h2>
        <div className="space-y-10 md:space-y-12 max-w-3xl">
          <div>
            <p className="border border-[#AE0000] text-black rounded-lg inline-block px-4 py-2 font-medium mb-2">
              Consigo cancelar ou editar uma reserva?
            </p>
            <p className="ml-2 border-b-4 text-black border-[#AE0000] pb-1">
              Sim! Você pode alterar ou cancelar suas reservas pelo próprio painel do usuário.
            </p>
          </div>
          <div>
            <p className="border border-[#AE0000] text-black rounded-lg inline-block px-4 py-2 font-medium mb-2">
              E se eu tiver dúvidas?
            </p>
            <p className="ml-2 border-b-4 border-[#AE0000] text-black pb-1">
              Você pode acessar o suporte diretamente pelo sistema!
            </p>
          </div>
          <div>
            <p className="border border-[#AE0000] text-black rounded-lg inline-block px-4 py-2 font-medium mb-2">
              E se eu me esquecer da reserva?
            </p>
            <p className="ml-2 border-b-4 border-[#AE0000] text-black pb-1">
              Estará tudo bem! Pois temos um lembrete para sempre te relembrar.
            </p>
          </div>
        </div>
      </section>

      <div className="max-1030:block min-1031:hidden h-24" />

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