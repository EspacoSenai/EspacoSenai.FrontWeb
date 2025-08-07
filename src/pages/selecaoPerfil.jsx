import React from 'react';
import '../App.css';


const SelecaoPerfil = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
      {/* Logo no canto superior esquerdo */}
      <div className="absolute top-0 left-0 p-6 z-20">
        <img 
          src="/logo.png" 
          alt="Logo Espaço Senai" 
          className="w-24 md:w-32"
        />
      </div>

      {/* Ondas decorativas no fundo */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <img 
          src="/src/assets/ondaPrincipal.svg" 
          alt="Onda decorativa" 
          className="w-full min-h-[120px] object-cover"
        />
      </div>

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white px-12 py-6 md:px-20 md:py-8 rounded-lg shadow-lg flex flex-col items-center">
        {/* Texto extra no topo */}
        <h2 className="text-center mb-6" style={{ fontSize: '25px', color: '#000', fontWeight: 'bold', lineHeight: '1.1' }}>
          Selecione um perfil<br />para acessar!
        </h2>

        {/* Botões de perfil */}
        <div className="space-y-4 w-full">
          <button className="w-full flex items-center justify-between py-2 px-4 border border-red-600 rounded-md text-gray-800 hover:bg-red-50 transition-colors">
            <span>Estudantes</span>
            <span className="ml-2">→</span>
          </button>
          <button className="w-full flex items-center justify-between py-2 px-4 border border-red-600 rounded-md text-gray-800 hover:bg-red-50 transition-colors">
            <span>Professores</span>
            <span className="ml-2">→</span>
          </button>
          <button className="w-full flex items-center justify-between py-2 px-4 border border-red-600 rounded-md text-gray-800 hover:bg-red-50 transition-colors">
            <span>Coordenadores</span>
            <span className="ml-2">→</span>
          </button>
          <button className="w-full flex items-center justify-between py-2 px-4 border border-red-600 rounded-md text-gray-800 hover:bg-red-50 transition-colors">
            <span>Administradores</span>
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelecaoPerfil;
