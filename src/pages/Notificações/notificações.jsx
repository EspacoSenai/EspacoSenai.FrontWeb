import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import setaLeft from '../../assets/setaleft.svg';
import lixeira from '../../assets/lixeira.svg';
import sinoSN from '../../assets/sinoSN.svg';
import lembrete from '../../assets/lembrete.svg';
import SemNotificacao from './semnotificação.jsx';



// Notificações iniciais (dados mock)
const notificacoesIniciais = [
  {
    id: 1,
    title: 'Lembrete!',
    body: 'Você tem uma reserva confirmada na Quadra das 13h45 até às 14h30. Garanta que estará pronto(a) com antecedência para aproveitar ao máximo o seu tempo.'
  },
  {
    id: 2,
    title: 'Agendamento cancelado!',
    body: 'Informamos que sua reserva no PS5 das 12h00 até às 13h25 foi cancelada, pois o espaço está indisponível no momento. Caso deseje, você pode verificar outros ambientes disponíveis.'
  },
  {
    id: 3,
    title: 'Lembrete!',
    body: 'Você tem uma reserva confirmada nos Computadores das 10h40 até às 11h20. Garanta que estará pronto(a) com antecedência para aproveitar ao máximo o seu tempo.'
  }
];
export default function Notificacoes() {
  const navigate = useNavigate();
  // Estado das notificações mostrado na tela
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);
  // guarda deslocamentos (translateX) por id para cada item
  const deslocamentosRef = useRef({});
  const inicioXRef = useRef(0);
  const arrastandoIdRef = useRef(null);
  const ponteiroAbaixadoRef = useRef(false);

  // Remove uma notificação por id
  const removerNotificacao = (id) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    // limpa estado de translate
    const copia = { ...deslocamentosRef.current };
    delete copia[id];
    deslocamentosRef.current = copia;
  };

  // se a lista ficar vazia, redireciona para a rota de sem notificação
  useEffect(() => {
    if (notificacoes.length === 0) {
      // usa replace para não empilhar histórico
      navigate('/semnotificacao', { replace: true });
    }
  }, [notificacoes, navigate]);

  // Atualiza o translate para um item e força re-render simples
  const setarDeslocamento = (id, x) => {
    deslocamentosRef.current = { ...deslocamentosRef.current, [id]: x };
    // força re-render mantendo mesmo array (simples e seguro aqui)
    setNotificacoes((prev) => [...prev]);
  };

  // Início do arraste (pointer down)
  const aoPressionarPonteiro = (e, id) => {
    ponteiroAbaixadoRef.current = true;
    arrastandoIdRef.current = id;
    inicioXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  // Movimento do ponteiro durante arraste
  const aoMoverPonteiro = (e) => {
    if (!ponteiroAbaixadoRef.current) return;
    const id = arrastandoIdRef.current;
    if (id == null) return;
    const dx = e.clientX - inicioXRef.current;
    // permitir apenas swipe para a esquerda (dx negativo)
    const translateX = Math.min(0, dx);
    setarDeslocamento(id, translateX);
  };

  // Solta o ponteiro: verifica limite para deletar ou retorna à posição
  const aoSoltarPonteiro = () => {
    if (!ponteiroAbaixadoRef.current) return;
    ponteiroAbaixadoRef.current = false;
    const id = arrastandoIdRef.current;
    arrastandoIdRef.current = null;
    const translateX = deslocamentosRef.current[id] || 0;
    // limite simples para remoção
    if (translateX < -100) {
      removerNotificacao(id);
      return;
    }
    // volta à posição original
    setarDeslocamento(id, 0);
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      {/* Topbar */}
  <header className="w-full bg-white border-b relative">
        <button onClick={() => window.history.back()} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 z-10">
          <img src={setaLeft} alt="voltar" className="w-6 h-6 bg-transparent text-gray-800" />
        </button>
        <div className="max-w-5xl mx-auto flex items-center py-4 px-4 sm:px-6">
          <div className="mx-auto flex items-center gap-2">
            <img src={sinoSN} alt="ícone" className="w-6 h-6 bg-transparent text-[#AE0000]" />
            <h1 className="text-lg font-semibold underline decoration-[#7c0c15] underline-offset-4">Suas notificações</h1>
          </div>
        </div>
      </header>

      {/* Banner full-bleed: ocupa toda a largura da tela e fica imediatamente abaixo do header */}
      <section className="w-full mt-0">
        <div className="bg-[#7c0c15] text-white p-6 text-center w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold">Você tem novas notificações!</h2>
            <p className="text-sm mt-2">Confira as atualizações mais recentes para ficar sempre atualizado.</p>
          </div>
        </div>
      </section>

      {/* Lista de notificações (full-width) */}
      <main className="w-full mt-6 px-4 sm:px-6 pb-12">
        {notificacoes.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <SemNotificacao />
          </div>
        ) : (
          <ul className="space-y-4">
            {notificacoes.map((n) => {
              const tx = deslocamentosRef.current[n.id] || 0;
              return (
                <li key={n.id} className="w-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                  <div
                    style={{ transform: `translateX(${tx}px)` }}
                    onPointerDown={(e) => aoPressionarPonteiro(e, n.id)}
                    onPointerMove={aoMoverPonteiro}
                    onPointerUp={aoSoltarPonteiro}
                    onPointerCancel={aoSoltarPonteiro}
                    className="w-full max-w-7xl mx-auto flex items-start gap-4 p-5 transition-transform duration-150"
                  >
                    <div className="flex-shrink-0 text-[#AE0000] mt-1">
                      <img src={lembrete} alt="lembrete" className="w-6 h-6 bg-transparent" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#111] text-left">{n.title}</h3>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed text-left">{n.body}</p>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      <button onClick={() => removerNotificacao(n.id)} className="p-2 text-gray-500 hover:text-red-600" aria-label="remover">
                        <img src={lixeira} alt="remover" className="w-6 h-6 bg-transparent" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
