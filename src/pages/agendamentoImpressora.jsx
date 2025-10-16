import React, { useMemo, useState, useEffect, useRef } from 'react'
import ModalDeAgendamento from '../components/agendamento/ModalDeAgendamento'
import sucessoIcon from '../assets/sucesso.svg'
import { montarPayload, COR_VERMELHO } from '../components/agendamento/FuncoesCompartilhada'

const daysOfWeek = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function getWeekDates(offsetWeeks = 0) {
  const now = new Date()
  const day = now.getDay()   
  const start = new Date(now)
  start.setDate(now.getDate() + offsetWeeks * 7)    
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
}

export default function AgendamentoImpressora() {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

  // Lista ampliada para demonstrar scroll
  const availableTimes = [
    '08:50', '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
    '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
    '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
    '14:00', '14:10', '14:20', '14:30', '14:40', '14:45'
  ]
  // Horários já agendados (ocupados)
  const bookedTimes = useMemo(() => new Set(['10:00', '14:00', '08:50']), [])
  const [selectedTime, setSelectedTime] = useState('08:50')
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [selectedPrinters, setSelectedPrinters] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [modal, setModal] = useState({ aberto: false, tipo: 'success', titulo: '', mensagem: '' })
  const modalBtnRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const displayedTimes = useMemo(() => {
    const term = String(searchTerm).trim()
    if (!term) return availableTimes
    // filtrar por substring e mostrar apenas horários livres quando há busca
    return availableTimes.filter(t => t.includes(term) && !bookedTimes.has(t))
  }, [searchTerm, availableTimes, bookedTimes])

  useEffect(() => {

    if (selectedDateIndex > 5) {
      setSelectedDateIndex(5)
    }
  }, [selectedDateIndex])

  function togglePrinter(n) {
    setSelectedPrinters(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    )
  }

  function abrirModal(tipo, titulo, mensagem) {
    setModal({ aberto: true, tipo, titulo, mensagem })
  }
  function fecharModal() {
    setModal(m => ({ ...m, aberto: false }))
  }

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && fecharModal()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  useEffect(() => {
    if (modal.aberto) {
      setTimeout(() => modalBtnRef.current?.focus(), 0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [modal.aberto])

  function resetForm() {
    setSelectedDateIndex(0)
    setSelectedTime('08:50')
    setSelectedPrinters([])
  }

  function handleConfirmar() {
    const dia = weekDates[selectedDateIndex]
    if (!dia || dia.desabilitado) {
      abrirModal('error', 'Data inválida', 'Selecione uma data válida para agendar.')
      return
    }
    if (!selectedTime) {
      abrirModal('error', 'Selecione os horários', 'Escolha o horário de início para continuar.')
      return
    }
    if (!selectedPrinters.length) {
      abrirModal('error', 'Selecione a impressora', 'Escolha ao menos uma impressora para continuar.')
      return
    }

    const semanaSelecionada = weekOffset === 0 ? 'essa' : 'proxima'
    const payload = montarPayload({
      recurso: 'IMPRESSORA',
      semanaSelecionada,
      dia: dia.dataCompleta,
      inicio: selectedTime,
      termino: null,
      extra: { printers: selectedPrinters },
    })

    setIsSubmitting(true)
    console.log('ENVIANDO PAYLOAD IMPRESSORA:', payload)
    setTimeout(() => {
      try {
        const success = true
        if (success) {
          abrirModal('success', 'Reserva realizada com sucesso!', 'Sua solicitação foi enviada e está aguardando aprovação.')
          resetForm()
        } else {
          abrirModal('error', 'Erro ao agendar', 'Ocorreu um erro ao processar sua solicitação.')
        }
      } catch (err) {
        console.error(err)
        abrirModal('error', 'Erro ao agendar', 'Ocorreu um erro ao processar sua solicitação.')
      } finally {
        setIsSubmitting(false)
      }
    }, 900)
  }

  return (
    <>
      <div className="max-w-full px-4 sm:max-w-6xl mx-auto p-6">
        <div className="bg-red-700 text-white rounded-lg px-6 py-8 md:py-7 mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-medium">Agendamento - <span className="font-semibold">Impressoras 3D</span></h2>
        </div>

        {/* Cabeçalho: duas colunas (controles à esquerda, Data à direita) */}
  <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 gap-4">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setWeekOffset(0)}
              className={`px-3 py-2 text-sm rounded-md font-medium ${weekOffset === 0 ? 'bg-red-700 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
              Essa semana
            </button>

            <button
              onClick={() => setWeekOffset(1)}
              className={`px-3 py-2 text-sm rounded-md font-medium ${weekOffset === 1 ? 'bg-red-700 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
              Próxima semana
            </button>
          </div>

          <div className="flex justify-end">
            <div className="flex gap-3 items-center overflow-x-auto no-scrollbar py-2 md:-ml-[100px]">
              <div className="font-semibold text-gray-700 mr-2">Data:</div>
              {weekDates.map((d, i) => (
                i === 6 ? null : (
                  <button
                    key={i}
                    onClick={() => setSelectedDateIndex(i)}
                    className={`min-w-[44px] w-10 h-16 rounded-md flex flex-col items-center justify-center text-xs ${selectedDateIndex === i ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-700'} focus:outline-none focus:ring-0`}>
                      <span className="text-[16px] leading-tight font-medium text-gray-400">{daysOfWeek[i]}</span>
                      <span className="mt-1 text-[16px] font-regular leading-tight">{String(d.getDate()).padStart(2, '0')}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mt-10">
          <div>
            <div className="mb-3 flex items-center gap-4">
              <div className="font-medium text-gray-900 text-left">Horário de início:</div>

              <div className="flex items-left bg-gray-200 border border-gray-200 rounded-lg px-2 py-3 w-28">
                <input
                  aria-label="Pesquisar horário"
                  placeholder="HR/MN"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full text-gray-600"
                />
              </div>
            </div>

            <div className="w-full sm:w-96 bg-gray-100/80 rounded-lg p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-4 thin-scroll">
                {displayedTimes.length === 0 ? (
                  <div className="col-span-3 p-4 text-sm text-gray-500">Nenhum horário encontrado</div>
                ) : (
                  displayedTimes.map((t) => {
                  const isBooked = bookedTimes.has(t)
                  const isSelected = selectedTime === t
                  return (
                    <button
                      key={t}
                      onClick={() => !isBooked && setSelectedTime(t)}
                      disabled={isBooked}
                      className={[
                        'py-2 px-2 rounded-md text-sm font-semibold transition-colors outline-none border',
                        'focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed',
                        isBooked && 'bg-gray-300 text-gray-800 border-gray-300',
                        !isBooked && !isSelected && 'bg-white text-black border-gray-300 hover:border-red-500 hover:bg-white',
                        isSelected && !isBooked && 'bg-red-700 text-white border-red-700 ring-2 ring-red-800',
                        isBooked && isSelected && 'bg-gray-400 text-white border-gray-400'
                      ].filter(Boolean).join(' ')}>
                      {t}
                      </button>
                    )
                  })
                  )}
              </div>
            </div>

            <div className="obs-note">
              <span className="label">OBS:</span>
              <span>O tempo de impressão pode variar e não é necessário informar o horário de término.</span>
            </div>

          </div>

          <div className="mt-8">
            <div>
              <div className="font-semibold mb-6 text-gray-800 text-left md:ml-[100px]">Impressoras 3D:</div>
              <div className="grid grid-cols-3 gap-6 md:ml-[100px] overflow-x-auto sm:overflow-visible justify-items-center">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const n = idx + 1
                  const isSelected = selectedPrinters.includes(n)
                  return (
                    <button
                      key={n}
                      onClick={() => togglePrinter(n)}
                      className={`py-3 px-3 rounded-lg text-base font-semibold transition-colors shadow-sm ${isSelected ? 'bg-red-700 text-white border-2 border-red-700' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                      style={{ width: '130px' }}>
                      {n}
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-20 sm:justify-end">
                <button disabled={isSubmitting} onClick={resetForm} className="px-6 py-2 border border-gray-800 rounded-lg text-base font-medium bg-white text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancelar</button>
                <button disabled={isSubmitting} onClick={handleConfirmar} className="px-6 py-2 bg-red-700 text-white rounded-lg text-base font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalDeAgendamento
        open={modal.aberto}
        onClose={fecharModal}
        type={modal.tipo}
        title={modal.titulo}
        message={modal.mensagem}
        sucessoIcon={sucessoIcon}
        primaryColor={COR_VERMELHO}
        ref={modalBtnRef}
      />
    </>
  )
}
