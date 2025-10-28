import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RESERVAS_INICIAIS = [
  { id: 1, tipo: 'PS5',       imagem: '/src/assets/ps5.svg',      data: '22/08', inicio: '14:00', termino: '15:30' },
  { id: 2, tipo: 'Quadra',    imagem: '/src/assets/quadra.svg',   data: '22/08', inicio: '14:30', termino: '16:00' },
  { id: 3, tipo: 'Sala Maker',imagem: '/src/assets/salamaker.svg',data: '03/09', inicio: '15:00', termino: '16:30' },
  { id: 4, tipo: 'PS5',       imagem: '/src/assets/ps5.svg',      data: '03/09', inicio: '14:00', termino: '15:30' },
  { id: 5, tipo: 'Quadra',    imagem: '/src/assets/quadra.svg',   data: '03/09', inicio: '14:30', termino: '16:00' },
  { id: 6, tipo: 'Sala Maker',imagem: '/src/assets/salamaker.svg',data: '03/09', inicio: '15:00', termino: '16:30' },
];

// Card de reserva 
function CardReserva({ reserva, selected, onToggle }) {
  const containerClasses = [
    'bg-white border border-gray-200 rounded-xl overflow-hidden',
    'p-[16px] sm:p-[20px] transition-transform duration-200 ease-out',
    selected
      ? 'scale-[1.02] ring-2 ring-[#AE0000] shadow-2xl'
      : 'shadow-lg hover:shadow-xl hover:scale-[1.01]'
  ].join(' ');

  return (
    <div className={containerClasses}>
      <img
        src={reserva.imagem}
        alt={`Imagem ${reserva.tipo}`}
        className="w-[298px] h-[143px] object-cover rounded-[12px] mx-auto cursor-pointer"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      />

      <div className="bg-[#AE0000] text-white font-medium flex items-center justify-center mx-auto w-[200px] h-[30px] border border-[#AE0000] rounded-[8px] mt-[12px]">
        {reserva.tipo}
      </div>

      <div className="flex justify-between p-1 text-xs mt-[16px]">
        <div className="text-center">
          <p className="font-medium text-black dark:text-white">Data</p>
          <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">{reserva.data}</p>
        </div>

        <div className="text-center">
          <p className="font-medium text-black dark:text-white">Início</p>
          <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">{reserva.inicio}</p>
        </div>

        <div className="text-center">
          <p className="font-medium text-black dark:text-white">Término</p>
          <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">{reserva.termino}</p>
        </div>
      </div>
    </div>
  );
}

function ReservaPendente() {
  const [reservasPendentes, setReservasPendentes] = useState(RESERVAS_INICIAIS);

  const [reservasSelecionadas, setReservasSelecionadas] = useState([]);

  useEffect(() => {

  }, []);

  const selecionarTodas = () => {
    if (reservasSelecionadas.length === reservasPendentes.length) {
      setReservasSelecionadas([]);
    } else {
      setReservasSelecionadas(reservasPendentes.map(reserva => reserva.id));
    }
  };

  const alternarSelecao = (id) => {
    if (reservasSelecionadas.includes(id)) {
      setReservasSelecionadas(reservasSelecionadas.filter(itemId => itemId !== id));
    } else {
      setReservasSelecionadas([...reservasSelecionadas, id]);
    }
  };

 
  const confirmarReservas = async () => {
    try {
      const novasReservas = reservasPendentes.filter(
        reserva => !reservasSelecionadas.includes(reserva.id)
      );
      
      setReservasPendentes(novasReservas);
      setReservasSelecionadas([]);
      
      // Feedback ao usuário (sucesso)
      alert('Reservas confirmadas com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar reservas:', error);
      alert('Erro ao confirmar reservas. Tente novamente.');
    }
  };

 
  const CardReserva = ({ reserva, selected, onToggle }) => (
  <div
    className={
      `bg-white border border-gray-200 rounded-xl overflow-hidden p-[16px] sm:p-[20px] transition-transform duration-200 ease-out ` +
      (selected
        ? 'scale-[1.02] ring-2 ring-[#AE0000] shadow-2xl'
        : 'shadow-lg hover:shadow-xl hover:scale-[1.01]')
    }
  >
      <img 
        src={reserva.imagem} 
        alt={`Imagem ${reserva.tipo}`} 
        className="w-[298px] h-[143px] object-cover rounded-[12px] mx-auto cursor-pointer" 
        onClick={onToggle}
      />
      <div className="bg-[#AE0000] text-white font-medium flex items-center justify-center mx-auto w-[200px] h-[30px] border border-[#AE0000] rounded-[8px] mt-[12px]">
        {reserva.tipo}
      </div>

      <div className="flex justify-between p-1 text-xs mt-[16px]">
        <div className="text-center">
          <p className="font-medium text-black dark:text-white">Data</p>
          <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">{reserva.data}</p>
        </div>

        <div className="text-center">
          <p className="font-medium text-black dark:text-white">Início</p>
          <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">{reserva.inicio}</p>
        </div>

        <div className="text-center">
          <p className="font-medium text-black dark:text-white">Término</p>
          <p className="bg-gray-300 border border-black rounded-[7px] px-3 py-1 text-black dark:text-white inline-block">{reserva.termino}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-[#AE0000] text-white py-6 px-6 sm:px-8 relative">
        <Link to="/admin-dashboard" className="absolute left-5 top-1/2 transform -translate-y-1/2 md:left-6">
          <img
            src="/src/assets/setawhiteleft.svg"
            alt="Voltar"
            className="w-8 h-8 md:w-10 md:h-10 transition-transform transform hover:scale-110 hover:-translate-x-1 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-md"
          />
        </Link>
        <h1 className="text-center text-xl font-semibold">Reservas Pendentes</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {/* Texto explicativo */}
        <p className="text-center mt-8 mb-9 text-base text-gray-800">
          Você poderá visualizar e confirmar reservas pendentes para<br />
          ambientes que exigem aprovação manual antes do uso!
        </p>
        
        {/* Separador */}
    <div className="border-b-2 border-[#720505] w-[307px] mx-auto mb-9"></div>

        {/* Botão de confirmar tudo */}
        <div className="flex justify-start mb-6">
          <button 
            onClick={selecionarTodas}
            className="bg-[#AE0000] text-white py-2 px-4 rounded-md hover:bg-[#8f0000] transition-colors"
          >
            Confirmar todos
          </button>
        </div>

        {/* Grade de reservas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 mb-6">
          {reservasPendentes.map((reserva, idx) => (
            <React.Fragment key={reserva.id}>
              <CardReserva
                reserva={reserva}
                selected={reservasSelecionadas.includes(reserva.id)}
                onToggle={() => alternarSelecao(reserva.id)}
              />

              {/* separador central */}
              {idx === 2 && (
                <div className="col-span-full flex justify-center">
                  <div className="w-[100%] border-t-2 border-[#A6A3A3] my-4"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botão de confirmar selecionadas */}
        {reservasSelecionadas.length > 0 && (
          <div className="flex justify-end mt-4">
            <button 
              onClick={confirmarReservas}
              className="bg-[#AE0000] text-white py-2 px-6 rounded-md hover:bg-[#8f0000] transition-colors"
            >
              Confirmar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReservaPendente;
