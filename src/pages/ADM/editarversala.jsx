import React, { useState } from 'react';

export default function EditarVersala() {
    const [materia, setMateria] = useState('');
    const [nomeTurma, setNomeTurma] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [tipo, setTipo] = useState('');

    const dias = ['S', 'T', 'Q', 'Q', 'S', 'S'];
    const [diasSelecionados, setDiasSelecionados] = useState([]); 
    
    const [inicioType, setInicioType] = useState('text');
    const [fimType, setFimType] = useState('text');

    const formularioValido = () => {
        return materia && nomeTurma && inicio && fim && tipo && diasSelecionados.length > 0; 
    };

    const [salvando, setSalvando] = useState(false);
    const [editadoSucesso, setEditadoSucesso] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSalvando(true);
        setTimeout(() => {
            setSalvando(false);
            alert('Editado com sucesso!');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white w-full overflow-x-hidden">
           <style>
               {`
               input.date-field::-webkit-datetime-edit { text-transform: uppercase; }
               input.date-field::-webkit-datetime-edit-fields-wrapper { text-transform: uppercase; }
               input.date-field::-webkit-calendar-picker-indicator { filter: brightness(0); }
               `}
           </style>

            {/* Cabeçalho */}
            <header className="bg-[#AE0000] text-white py-4 md:py-6 w-full">
                <h1 className="text-center text-xl md:text-2xl font-medium">Salas</h1>
            </header>

            {/* Conteúdo */}
            <main className="w-full px-4 md:px-8 py-8 md:py-14"> 
                <div className="bg-white rounded-none shadow-none p-4 md:p-8 min-h-screen max-w-7xl mx-auto">

                    {/* Subtítulo e divisor */}
                    <p className="text-center text-sm md:text-lg text-gray-900 -mt-6 md:-mt-9 px-2">
                        Você pode visualizar e editar as informações da turma de forma simples e <br className="hidden md:block" />
                        atualizada!
                    </p>
                    <div className="w-[150px] md:w-[200px] mx-auto mt-3 mb-6 md:mb-8 border-b-4 border-[#AE0000] rounded-full" />
                    
                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="w-full">

                        {/* Grid principal */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                            {/* Coluna Esquerda */}
                            <div className="space-y-8 md:space-y-12 w-full"> 
                                {/* Matéria */}
                                <div className="w-full">
                                    <label className="block text-gray-900 font-regular text-base md:text-lg mb-2 text-left md:ml-[90px]">
                                        Matéria:
                                    </label>
                                    <input
                                        type="text"
                                        value={materia}
                                        onChange={(e) => setMateria(e.target.value)}    
                                        placeholder="Front-End"
                                        autoComplete="off"
                                        className="w-full md:w-[370px] bg-gray-100 rounded-md pl-3 pr-4 py-2.5 text-sm md:text-base text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#AE0000]"
                                    />
                                </div>

                                {/* Nome da turma */}
                                <div className="w-full">
                                    <label className="block text-gray-900 font-regular text-base md:text-lg mb-2 text-left md:ml-[90px]">
                                        Nome da turma:
                                    </label>
                                    <input
                                        type="text"
                                        value={nomeTurma}
                                        onChange={(e) => setNomeTurma(e.target.value)}
                                        placeholder="Seduc1"
                                        autoComplete="off"
                                        className="w-full md:w-[370px] bg-gray-100 rounded-md pl-3 pr-4 py-2.5 text-sm md:text-base text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#AE0000]"
                                    />
                                </div>

                                {/* Tipo */}
                                <div className="w-full">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:ml-[90px]">
                                    <span className="text-gray-900 font-regular text-base md:text-lg whitespace-nowrap">Tipo:</span>
                                    <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                                      {['Fic', 'Faculdade', 'Técnico'].map((t) => (
                                        <button
                                          key={t}
                                          type="button"
                                          onClick={() => setTipo(t)}
                                          className={
                                            'px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium border transition-colors ' +
                                            (tipo === t
                                              ? 'bg-[#AE0000] text-white border-[#AE0000]'
                                              : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200')
                                          }
                                        >
                                          {t}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                            </div>

                            {/* Coluna Direita */}
                            <div className="space-y-8 md:space-y-10 w-full">  
                                {/* Data */}
                                <div className="w-full">   
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2 md:ml-[180px]" role="group" aria-label="Dias da semana">
                                    <span className="text-gray-900 font-regular text-base md:text-lg whitespace-nowrap">Data:</span>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {dias.map((d, idx) => (
                                        <button
                                          key={`${d}-${idx}`}
                                          type="button"
                                          role="checkbox"
                                          aria-checked={diasSelecionados.includes(idx)}
                                          onClick={() => setDiasSelecionados(prev => 
                                            prev.includes(idx) 
                                              ? prev.filter(i => i !== idx) 
                                              : [...prev, idx]
                                          )}
                                          className={
                                            'w-10 h-10 md:w-10 md:h-12 flex items-center justify-center rounded-md border text-sm font-regular transition-colors ' +
                                            (diasSelecionados.includes(idx)
                                              ? 'bg-[#AE0000] text-white border-[#AE0000]'
                                              : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200')
                                          }
                                        >
                                          <span className="leading-none">{d}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Duração */}
                                <div className="w-full md:ml-[245px]">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                                        <span className="text-gray-900 font-regular text-base md:text-lg whitespace-nowrap">Duração:</span>
                                        <div className="flex flex-col gap-4 w-full md:w-auto">
                                            <input
                                                id="duracao-inicio"
                                                type={inicioType}
                                                value={inicio}
                                                onFocus={() => setInicioType('date')}
                                                onBlur={(e) => { if (!e.target.value) setInicioType('text'); }}
                                                onChange={(e) => setInicio(e.target.value)}
                                                placeholder="Início"
                                                autoComplete="off"
                                                className="date-field w-full md:w-[150px] bg-gray-100 rounded-md px-4 py-2.5 text-sm md:text-base text-gray-900 outline-none focus:ring-2 focus:ring-[#AE0000] placeholder-gray-500"
                                            />
                                            <input
                                                id="duracao-fim"
                                                type={fimType}
                                                value={fim}
                                                onFocus={() => setFimType('date')}
                                                onBlur={(e) => { if (!e.target.value) setFimType('text'); }}
                                                onChange={(e) => setFim(e.target.value)}
                                                placeholder="Fim"
                                                autoComplete="off"
                                                className="date-field w-full md:w-[150px] bg-gray-100 rounded-md px-4 py-2.5 text-sm md:text-base text-gray-900 outline-none focus:ring-2 focus:ring-[#AE0000] placeholder-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botão Editar */}
                        <div className="flex justify-center md:justify-end mt-12 md:mt-24 md:px-12">
                            <button
                                type="submit"
                                disabled={!formularioValido() || salvando}
                                className="min-w-[120px] md:min-w-[140px] rounded-md bg-[#B10404] text-white py-2 md:py-1 px-5 md:px-6 text-sm md:text-base hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
                                aria-disabled={!formularioValido() || salvando}
                            >
                                {salvando ? 'Editando...' : 'Editar'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}