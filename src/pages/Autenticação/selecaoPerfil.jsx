import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import logoImg from '../../assets/EspacoSenai.svg';
import ondasVectorImg from '../../assets/ondas vector.svg';
import setaImg from '../../assets/seta.svg';

const perfis = [
  { label: 'Estudantes', key: 'ALUNO' },
  { label: 'Professores', key: 'PROFESSOR' },
  { label: 'Coordenadores', key: 'COORDENADOR' },
  { label: 'Administradores', key: 'ADMIN' },
];

export default function SelecaoPerfil() {
  const navigate = useNavigate();

  const escolher = (key) => {
    localStorage.setItem('selected_profile', key);
    navigate('/login');
  };

  return (
    <div className="min-h-screen min-w-full w-screen h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 flex flex-col items-start p-4 md:p-6 z-20">
        <img src={logoImg} alt="Logo Espaço Senai" className="w-24 sm:w-28 md:w-36" />
      </div>

      <div className="absolute bottom-0 left-0 w-full z-0">
        <img src={ondasVectorImg} alt="Onda decorativa" className="w-full min-h-[100px] md:min-h-[120px] object-cover" />
      </div>

      <div className="relative z-10 mx-auto bg-white flex flex-col border border-gray-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] text-center w-full max-w-[440px] h-auto min-h-[525px] p-4 md:p-[10px] md:px-20 rounded-lg"
           style={{ width: '440px', height: '525px', borderRadius: '10px', padding: '10px 82px' }}>
        <h2 className="text-center mb-12 md:mb-16 text-2xl md:text-[28px] leading-10 mt-10 md:mt-[40px]"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 560, fontSize: '28px', lineHeight: '40px', color: '#000', margin: 0, marginTop: '40px' }}>
          Selecione um perfil <br /> para acessar!
        </h2>

        <div className="space-y-4 md:space-y-5 w-full mt-10 md:mt-14 flex flex-col items-center justify-center">
          {perfis.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => escolher(key)}
              className="relative group bg-white flex items-center justify-between mx-auto text-gray-800 group-hover:text-white transition-all duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 border border-red-600 group-hover:border-black overflow-hidden hover:scale-105 hover:shadow-lg hover:z-10 w-full max-w-[295px] h-14 md:h-[57px] rounded-lg px-6 md:px-[24px] text-lg md:text-[20px]"
              style={{ width: '295px', height: '57px', borderRadius: '10px', borderWidth: '1px', padding: '0 24px', fontSize: '20px' }}
            >
              <span className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-80 transition-opacity duration-200" style={{ backgroundColor: '#AE0000' }} />
              <span className="relative z-10 w-full flex items-center justify-between">
                <span>{label}</span>
                <img src={setaImg} alt="Seta" className="ml-2 w-5 h-5 md:w-6 md:h-6" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
