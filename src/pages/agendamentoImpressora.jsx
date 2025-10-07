import React, { useMemo, useState, useEffect } from 'react'

const daysOfWeek = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function getWeekDates(offsetWeeks = 0) {
  const now = new Date()
  const day = now.getDay() // aqui define o dia para agendamento
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

  useEffect(() => {
    // if selected index was the removed last item (6), clamp it to 5
    if (selectedDateIndex > 5) {
      setSelectedDateIndex(5)
    }
  }, [selectedDateIndex])

  function togglePrinter(n) {
    setSelectedPrinters(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-red-700 text-white rounded-lg px-6 py-4 mb-6 text-center">
        <h2 className="text-xl font-regular">Agendamento - <span className="font-semibold">Impressoras 3D</span></h2>
      </div>

      {/* Cabeçalho: duas colunas (controles à esquerda, Data à direita) */}
      <div className="grid grid-cols-2 items-center mb-4">
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
          <div className="grid grid-flow-col gap-2 items-center justify-items-start -ml-18">
            <div className="font-semibold text-gray-700 mr-2">Data:</div>
            {weekDates.map((d, i) => (
              i === 6 ? null : (
                <button
                  key={i}
                  onClick={() => setSelectedDateIndex(i)}
                  className={`w-10 h-14 rounded-md flex flex-col items-center justify-center text-xs ${selectedDateIndex === i ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-700'} focus:outline-none focus:ring-0`}>
                      <span className="text-[16px] leading-tight font-medium text-gray-400">{daysOfWeek[i]}</span>
                      <span className="text-[14px] font-regular leading-tight">{String(d.getDate()).padStart(2, '0')}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>

  <div className="grid grid-cols-2 gap-10 items-start mt-10">
        <div>
          <div className="mb-3 font-medium text-gray-900 text-left">Horário de início:</div>
          <div className="w-80 bg-gray-100/80 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-4 thin-scroll">
              {availableTimes.map((t) => {
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
              })}
            </div>
          </div>
          <div className="obs-note">
            <span className="label">OBS:</span>
            <span>O tempo de impressão pode variar e não é necessário informar o horário de término.</span>
          </div>

        </div>

        <div>
          <div>
            <div className="font-medium mb-4 text-gray-800">Impressoras 3D:</div>
            <div className="grid grid-cols-3 gap-3 w-64 ml-auto justify-items-start">
              {Array.from({ length: 6 }).map((_, idx) => {
                const n = idx + 1
                const isSelected = selectedPrinters.includes(n)
                return (
                  <button
                    key={n}
                    onClick={() => togglePrinter(n)}
                    className={`py-3 rounded-md text-sm font-semibold transition-colors ${isSelected ? 'bg-red-700 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                    {n}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-4 mt-6 justify-start lg:justify-end">
              <button className="px-6 py-3 border rounded text-gray-700 hover:border-red-500 transition-colors">Cancelar</button>
              <button className="px-6 py-3 bg-red-700 text-white rounded hover:bg-red-800 transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
