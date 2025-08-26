import React from 'react';
import '../../App.css';
import logoImg from '../../assets/EspacoSenai.svg';
import ondasVectorImg from '../../assets/ondas vector.svg';
import setaImg from '../../assets/seta.svg';


const SelecaoPerfil = () => {
  return (
    <div className="min-h-screen min-w-full w-screen h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Logo e nome no canto superior esquerdo */}
      <div className="absolute top-0 left-0 flex flex-col items-start p-6 z-20">
        <img 
          src={logoImg}
          alt="Logo Espaço Senai" 
          className="w-24 md:w-32"
        />
        <span className="mt-2 text-xl md:text-2xl font-bold text-red-700 tracking-wide" style={{letterSpacing: '1px'}}></span>
      </div>

      {/* Ondas decorativas no fundo */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <img 
          src={ondasVectorImg}
          alt="Onda decorativa" 
          className="w-full min-h-[120px] object-cover"
        />
      </div>

      {/* Container principal */}
      <div
        className="relative z-10 mx-auto bg-white flex flex-col border border-gray-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] text-center"
        style={{ width: '440px', height: '525px', borderRadius: '10px', padding: '10px 82px' }}
      >
        {/* Texto extra no topo */}
        <h2
          className="text-center mb-16"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 560,
            fontSize: '28px',
            lineHeight: '40px',
            color: '#000',
            margin: 0,
            marginTop: '40px',
            
          }}
        >
          Selecione um perfil <br /> para acessar!
        </h2>

        {/* Botões de perfil */}
  <div className="space-y-5 w-full mt-14 flex flex-col items-center justify-center" style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <button
            className="flex items-center justify-between mx-auto text-gray-800 hover:bg-red-50 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 border border-red-600"
            style={{ width: '295px', height: '57px', borderRadius: '10px', borderWidth: '1px', padding: '0 24px', fontSize: '20px' }}
          >
            <span>Estudantes</span>
            <img src={setaImg} alt="Seta" className="ml-2 w-6 h-6" />
          </button>
          <button
            className="flex items-center justify-between mx-auto text-gray-800 hover:bg-red-50 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 border border-red-600"
            style={{ width: '295px', height: '57px', borderRadius: '10px', borderWidth: '1px', padding: '0 24px', fontSize: '20px' }}
          >
            <span>Professores</span>
            <img src={setaImg} alt="Seta" className="ml-2 w-6 h-6" />
          </button>
          <button
            className="flex items-center justify-between mx-auto text-gray-800 hover:bg-red-50 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 border border-red-600"
            style={{ width: '295px', height: '57px', borderRadius: '10px', borderWidth: '1px', padding: '0 24px', fontSize: '20px' }}
          >
            <span>Coordenadores</span>
            <img src={setaImg} alt="Seta" className="ml-2 w-6 h-6" />
          </button>
          <button
            className="flex items-center justify-between mx-auto text-gray-800 hover:bg-red-50 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 border border-red-600"
            style={{ width: '295px', height: '57px', borderRadius: '10px', borderWidth: '1px', padding: '0 24px', fontSize: '20px' }}
          >
            <span>Administradores</span>
            <img src={setaImg} alt="Seta" className="ml-2 w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelecaoPerfil;
