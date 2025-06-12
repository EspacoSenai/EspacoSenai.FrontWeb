import React from 'react';

export default function Footer() {
  return (
    <>
      {/* Retângulo com a logo colada no footer */}
    <div className="bg-[#757575] top-[210px] w-[80%] h-20 relative z-20 py-8 mb-[-10px] mx-auto">
        <div className="container mx-auto text-center">
            <img src="src/assets/EspacoSenai.svg" alt="Logo EspaçoSenai" className="w-20 rounded-full  mx-auto" />
        </div>
    </div>


      {/* Rodapé */}
      <footer className="bg-[#333333] text-white py-8 bottom-[-200px] mt-[-10px] relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          {/* Colunas do Rodapé */}
          <div className="flex flex-col md:flex-row gap-12 text-center md:text-left justify-between items-center md:items-start">
            {/* Coluna: INFORMAÇÕES */}
            <div>
              <h4 className="font-semibold text-center mb-4">INFORMAÇÕES</h4>
              <ul className="space-y-2 text-center">
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                </li>
              </ul>
              <div className="flex justify-center gap-4 mt-4">
                {/* Espaço para redes sociais (SVGs) */}
                <a href="#" className="hover:text-gray-300">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="hover:text-gray-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover:text-gray-300">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Coluna: NAVEGAÇÃO */}
            <div>
              <h4 className="font-semibold mb-4">NAVEGAÇÃO</h4>
              <ul className="space-y-3 text-center">
                <li>
                  <a href="#" className="hover:text-gray-300">O que é o EspaçoSenai</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">Como Funciona</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">Perguntas Frequentes</a>
                </li>
              </ul>
            </div>

            {/* Coluna: CONTATO */}
            <div>
              <h4 className="font-semibold mb-4">CONTATO</h4>
              <ul className="space-y-2 text-center">
                <li>
                  <a href="mailto:contato@espacosenai.com" className="hover:text-gray-300 border-b-2 border-white">Email</a>
                </li>
                <li>
                  <a href="tel:+1123456789" className="hover:text-gray-300 border-b-2 border-white">Telefone</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links de Política de Privacidade e Termos de Uso */}
        <div className="text-center py-4">
          <a href="#" className="text-gray-300 hover:text-white mr-4">Política de Privacidade</a>
          <a href="#" className="text-gray-300 hover:text-white">Termos de Uso</a>
        </div>
      </footer>
    </>
  );
}
