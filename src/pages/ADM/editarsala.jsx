import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { atualizarAmbiente, buscarTodosAmbientes } from "../../service/ambiente";
import {
  salvarCatalogos,
  atualizarCatalogos,
  deletarCatalogos,
  buscarCatalogosPorAmbiente,
  agruparPorDiaSemana,
  formatarHora,
} from "../../service/catalogo";
import {
  normalizarChave,
  encontrarAmbientePorChave,
  ehAmbienteComputador,
  filtrarAmbientesComputador,
} from "../../utils/ambientes";

const FONT_BASE = "font-poppins";
const TXT_LABEL = "text-sm font-medium text-gray-700 block w-full text-left mb-1 " + FONT_BASE;

const CL_INPUT =
  "w-full h-10 rounded-md bg-gray-100 border border-gray-200 px-3 text-[15px] text-black shadow-sm outline-none focus:ring-2 focus:ring-[#B10404] " +
  FONT_BASE;

const CL_TEXTAREA =
  "w-full h-28 rounded-md bg-gray-100 border border-gray-200 px-3 py-2 text-[15px] text-black shadow-sm outline-none resize-none focus:ring-2 focus:ring-[#B10404] " +
  FONT_BASE;

const CL_SELECT =
  "w-full h-10 rounded-md bg-gray-100 border border-gray-200 px-3 text-[15px] text-black shadow-sm outline-none focus:ring-2 focus:ring-[#B10404] appearance-none cursor-pointer " +
  FONT_BASE;

const CL_TAG_BASE =
  "px-3 py-2 rounded-md border text-sm shadow-sm cursor-pointer transition-colors " +
  FONT_BASE;
const CL_TAG_ON = "bg-[#B10404] text-white border-[#B10404]";
const CL_TAG_OFF = "bg-white text-gray-700 border-gray-200";

const DIAS_SEMANA = [
  { value: "", label: "-- Selecione --" },
  { value: "SEGUNDA", label: "Segunda-feira" },
  { value: "TERCA", label: "Terça-feira" },
  { value: "QUARTA", label: "Quarta-feira" },
  { value: "QUINTA", label: "Quinta-feira" },
  { value: "SEXTA", label: "Sexta-feira" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
];

const DIAS_LABELS = {
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

const normalizarHoraParaApi = (valor) => {
  const raw = String(valor || "").trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^\d{2}:\d{2}$/.test(raw)) return `${raw}:00`;
  return raw;
};


export default function EditarSala() {
  const { nomeAmbiente: nomeParam } = useParams();
  const ambienteSlug = nomeParam ? decodeURIComponent(nomeParam) : "";

  // Estados do ambiente
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("DISPONIVEL");
  const [aprovacao, setAprovacao] = useState("MANUAL");
  const [qtdPessoas, setQtdPessoas] = useState("");
  const [ambienteDetalhes, setAmbienteDetalhes] = useState(null);

  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Detectar perfil do usuário para rota de voltar
  const isAdmin = localStorage.getItem("userRole")?.includes("ADMIN");
  const rotaVoltar = isAdmin ? "/salas-adm" : "/salas-coordenadores";

  // Estados do catálogo
  const [catalogos, setCatalogos] = useState([]);
  const [carregandoCatalogos, setCarregandoCatalogos] = useState(false);
  const [catalogoEditando, setCatalogoEditando] = useState(null);
  const [diaSemana, setDiaSemana] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [dispCatalogo, setDispCatalogo] = useState("DISPONIVEL");
  const [salvandoCatalogo, setSalvandoCatalogo] = useState(false);
  const [ambientesSincronizados, setAmbientesSincronizados] = useState([]);
  const [sincronizandoCatalogos, setSincronizandoCatalogos] = useState(false);
  const sincronizandoRef = useRef(false);
  const sincronizacaoInicialRef = useRef(false);

  const chaveAmbienteSlug = useMemo(
    () => normalizarChave(ambienteSlug),
    [ambienteSlug]
  );

  const ambienteIdNumber = useMemo(() => {
    const rawId = Number(ambienteDetalhes?.id);
    return Number.isFinite(rawId) ? rawId : null;
  }, [ambienteDetalhes?.id]);

  const nomeAtualAmbiente = ambienteDetalhes?.nome || ambienteSlug;

  const isGrupoComputadores = useMemo(
    () => ehAmbienteComputador(nomeAtualAmbiente),
    [nomeAtualAmbiente]
  );

  const idsReplicacao = useMemo(() => {
    if (!isGrupoComputadores || !ambientesSincronizados.length) return [];
    return ambientesSincronizados
      .map((amb) => Number(amb?.id))
      .filter((id) => Number.isFinite(id) && id !== ambienteIdNumber);
  }, [ambientesSincronizados, isGrupoComputadores, ambienteIdNumber]);

  const formValido =
    nome.trim() && descricao.trim() && Number(qtdPessoas) > 0;

  const formCatalogoValido =
    diaSemana && horaInicio && horaFim && horaFim > horaInicio;

  // BUSCAR SALA NA LISTA COMPLETA
  useEffect(() => {
    let alive = true;

    if (!chaveAmbienteSlug) {
      setCarregando(false);
      setAmbienteDetalhes(null);
      setErro("Nome do ambiente inválido.");
      return () => {
        alive = false;
      };
    }

    (async () => {
      try {
        setCarregando(true);
        setErro("");

        const ambientesResponse = await buscarTodosAmbientes();
        const ambientes = Array.isArray(ambientesResponse)
          ? ambientesResponse
          : Array.from(ambientesResponse || []);
        if (!alive) return;

        // Se o slug for "Computadores", carregar PC1 como representante
        const chaveParaBuscar = chaveAmbienteSlug === "computadores" 
          ? "pc1" 
          : chaveAmbienteSlug;

        const ambienteEncontrado = encontrarAmbientePorChave(
          ambientes,
          chaveParaBuscar
        );

        if (!ambienteEncontrado || !ambienteEncontrado.id) {
          throw new Error("Ambiente não encontrado.");
        }

        console.log("[EditarSala] ambiente carregado:", ambienteEncontrado);
        setAmbienteDetalhes(ambienteEncontrado);

        setNome(ambienteEncontrado?.nome || "");
        setDescricao(ambienteEncontrado?.descricao || "");

        setDisponibilidade(
          (
            ambienteEncontrado?.disponibilidade ||
            ambienteEncontrado?.status ||
            "DISPONIVEL"
          ).toUpperCase()
        );
        setAprovacao(
          (
            ambienteEncontrado?.aprovacao ||
            ambienteEncontrado?.tipoAprovacao ||
            "MANUAL"
          ).toUpperCase()
        );

        setQtdPessoas(
          ambienteEncontrado?.qtdPessoas != null && ambienteEncontrado?.qtdPessoas !== ""
            ? String(ambienteEncontrado.qtdPessoas)
            : ""
        );

        // Se slug for "Computadores" ou ambiente for um PC, tratar como grupo
        const ehComputador = chaveAmbienteSlug === "computadores" || 
          ehAmbienteComputador(ambienteEncontrado?.nome || ambienteSlug);
        
        if (ehComputador) {
          const todosComputadores = filtrarAmbientesComputador(ambientes || []);
          setAmbientesSincronizados(
            todosComputadores.length ? todosComputadores : [ambienteEncontrado]
          );
          
          // Quando slug for "Computadores", atualizar nome para indicar grupo
          if (chaveAmbienteSlug === "computadores") {
            setNome("Computadores (PC1-PC5)");
          }
        } else {
          setAmbientesSincronizados([ambienteEncontrado]);
        }

        // Reset sincronização inicial quando trocar de ambiente
        sincronizacaoInicialRef.current = false;
      } catch (err) {
        console.error("[EditarSala] Erro ao buscar ambiente:", err);
        if (!alive) return;

        const msgBack =
          err?.response?.data?.message ||
          err?.response?.data?.mensagem ||
          err?.message;

        setErro(
          msgBack ||
          "Não foi possível carregar os dados da sala. Tente novamente mais tarde."
        );
      } finally {
        if (alive) setCarregando(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [chaveAmbienteSlug]);

  // BUSCAR CATÁLOGOS DO AMBIENTE  
  useEffect(() => {
    if (!ambienteIdNumber) {
      setCatalogos([]);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setCarregandoCatalogos(true);
        console.log(`[EditarSala] Carregando catálogos do ambiente ID ${ambienteIdNumber}...`);
        const catalogosData = await buscarCatalogosPorAmbiente(ambienteIdNumber);
        console.log(`[EditarSala] Catálogos carregados:`, catalogosData);
        if (alive) {
          setCatalogos(Array.isArray(catalogosData) ? catalogosData : []);
        }
      } catch (err) {
        console.error("[EditarSala] Erro ao buscar catálogos:", err);
        if (alive) setCatalogos([]);
      } finally {
        if (alive) setCarregandoCatalogos(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [ambienteIdNumber]);

  const sincronizarCatalogosEntreComputadores = useCallback(
    async (catalogosBase) => {
      if (!idsReplicacao.length) return;
      const base = Array.isArray(catalogosBase) ? catalogosBase : [];
      if (sincronizandoRef.current) return;

      sincronizandoRef.current = true;
      setSincronizandoCatalogos(true);
      try {
        const payloadBase = base.map((cat) => ({
          diaSemana: cat.diaSemana,
          horaInicio: normalizarHoraParaApi(cat.horaInicio),
          horaFim: normalizarHoraParaApi(cat.horaFim),
          disponibilidade: cat.disponibilidade || "DISPONIVEL",
        }));

        for (const idDestino of idsReplicacao) {
          const destinoId = Number(idDestino);
          if (!Number.isFinite(destinoId)) continue;
          try {
            const existentes = await buscarCatalogosPorAmbiente(destinoId);
            const idsExistentes = (Array.isArray(existentes) ? existentes : [])
              .map((item) => Number(item?.id))
              .filter((num) => Number.isFinite(num));

            if (idsExistentes.length) {
              await deletarCatalogos(idsExistentes);
            }

            if (payloadBase.length) {
              const payloadDestino = payloadBase.map((cat) => ({
                ...cat,
                idAmbiente: destinoId,
                ambienteId: destinoId,
              }));
              await salvarCatalogos(destinoId, payloadDestino);
            }
          } catch (syncErr) {
            console.error(
              `[EditarSala] Falha ao sincronizar catálogos para o ambiente ${destinoId}:`,
              syncErr
            );
          }
        }
      } finally {
        sincronizandoRef.current = false;
        setSincronizandoCatalogos(false);
      }
    },
    [idsReplicacao]
  );

  // Sincronização inicial: quando carregar os catálogos pela primeira vez
  useEffect(() => {
    if (!idsReplicacao.length || !catalogos.length) return;
    if (sincronizacaoInicialRef.current) return;
    
    console.log('[EditarSala] Executando sincronização inicial dos catálogos para todos os PCs...');
    sincronizacaoInicialRef.current = true;
    sincronizarCatalogosEntreComputadores(catalogos);
  }, [catalogos, idsReplicacao, sincronizarCatalogosEntreComputadores]);

  // Sincronização contínua: quando modificar os catálogos depois
  useEffect(() => {
    if (!idsReplicacao.length || !sincronizacaoInicialRef.current) return;
    sincronizarCatalogosEntreComputadores(catalogos);
  }, [catalogos, idsReplicacao, sincronizarCatalogosEntreComputadores]);

  // Catálogos agrupados por dia
  const catalogosAgrupados = useMemo(() => {
    return agruparPorDiaSemana(catalogos);
  }, [catalogos]);

  // Calcula duração
  function calcularDuracao(inicio, fim) {
    if (!inicio || !fim) return "";
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fim.split(":").map(Number);
    const totalMinInicio = h1 * 60 + m1;
    const totalMinFim = h2 * 60 + m2;
    const diff = totalMinFim - totalMinInicio;
    if (diff <= 0) return "";
    const horas = Math.floor(diff / 60);
    const minutos = diff % 60;
    if (horas === 0) return `${minutos}min`;
    if (minutos === 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
  }


  function handleQtdChange(e) {
    const raw = e.target.value;
    if (raw === "") {
      setQtdPessoas("");
      return;
    }
    if (!/^\d+$/.test(raw)) return;
    setQtdPessoas(raw);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formValido) return;

    if (!ambienteIdNumber) {
      setErro("Não foi possível identificar o ambiente para salvar.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      await atualizarAmbiente(ambienteIdNumber, {
        nome: nome.trim(),
        descricao: descricao.trim(),
        disponibilidade,
        aprovacao,
        qtdPessoas: Number(qtdPessoas),
      });

      setSucesso("Sala atualizada com sucesso!");
    } catch (err) {
      console.error("[EditarSala] Erro ao atualizar sala:", err);

      const msgBack =
        err?.response?.data?.message ||
        err?.response?.data?.mensagem ||
        err?.message;

      setErro(
        `Erro ao atualizar sala.${msgBack ? " Detalhes: " + String(msgBack) : ""
        }`
      );
    } finally {
      setSalvando(false);
    }
  }

  // Adicionar ou atualizar horário
  async function handleAdicionarHorario(e) {
    e.preventDefault();
    if (!formCatalogoValido) return;

    setSalvandoCatalogo(true);
    setErro("");
    setSucesso("");

    const ambienteNome = (ambienteDetalhes?.nome || ambienteSlug || nome || "").trim();
    if (!ambienteNome) {
      setErro("Não foi possível identificar o ambiente. Recarregue a tela e tente novamente.");
      setSalvandoCatalogo(false);
      return;
    }

    if (!ambienteIdNumber) {
      setErro("Não foi possível identificar o ID interno do ambiente.");
      setSalvandoCatalogo(false);
      return;
    }

    const catalogoData = {
      idAmbiente: ambienteIdNumber,
      ambienteId: ambienteIdNumber,
      diaSemana,
      horaInicio: horaInicio + ":00",
      horaFim: horaFim + ":00",
      disponibilidade: dispCatalogo,
    };

    catalogoData.ambienteNome = ambienteNome;
    catalogoData.nomeAmbiente = ambienteNome;

    console.log("[EditarSala] Dados do catálogo a enviar:", catalogoData);

    try {
      if (catalogoEditando) {
        // Editando catálogo existente
        await atualizarCatalogos(catalogoEditando.id, { ...catalogoData, id: catalogoEditando.id });
        setSucesso("Horário atualizado com sucesso!");
      } else {
        // Adicionando novo catálogo
        await salvarCatalogos(ambienteIdNumber, catalogoData);
        setSucesso("Horário adicionado com sucesso!");
      }

      // Recarregar catálogos
      const catalogosData = await buscarCatalogosPorAmbiente(ambienteIdNumber);
      setCatalogos(Array.isArray(catalogosData) ? catalogosData : []);

      // Limpar form
      limparFormCatalogo();
    } catch (err) {
      console.error("[EditarSala] Erro ao salvar:", err);
      console.error("[EditarSala] Detalhes do erro:", err?.response?.data);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.mensagem ||
        err?.message ||
        (catalogoEditando ? "Erro ao atualizar horário." : "Erro ao adicionar horário.");
      setErro(msg);

      if (ambienteIdNumber) {
        try {
          const catalogosData = await buscarCatalogosPorAmbiente(ambienteIdNumber);
          setCatalogos(Array.isArray(catalogosData) ? catalogosData : []);
        } catch (reloadErr) {
          console.error("[EditarSala] Erro ao recarregar após falha:", reloadErr);
        }
      }
    } finally {
      setSalvandoCatalogo(false);
    }
  }

  // Limpar formulário de catálogo
  function limparFormCatalogo() {
    setCatalogoEditando(null);
    setDiaSemana("");
    setHoraInicio("");
    setHoraFim("");
    setDispCatalogo("DISPONIVEL");
  }

  // Editar catálogo
  function handleEditarCatalogo(catalogo) {
    setCatalogoEditando(catalogo);
    setDiaSemana(catalogo.diaSemana);
    setHoraInicio(formatarHora(catalogo.horaInicio).substring(0, 5));
    setHoraFim(formatarHora(catalogo.horaFim).substring(0, 5));
    setDispCatalogo(catalogo.disponibilidade);
    window.scrollTo({ top: 450, behavior: 'smooth' });
  }

  // Remover catálogo
  async function handleRemoverCatalogo(catalogoId) {
    if (!window.confirm("Deseja remover este horário do catálogo?")) return;

    try {
      await deletarCatalogos([catalogoId]);
      setCatalogos((prev) => prev.filter((c) => c.id !== catalogoId));
      setSucesso("Horário removido com sucesso!");
    } catch (err) {
      console.error("[EditarSala] Erro ao remover:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.mensagem ||
        err?.message ||
        "Erro ao remover horário.";
      setErro(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Cabeçalho simples */}
      <header className="w-full bg-[#B10404]">
        <div className="mx-auto max-w-4xl h-14 flex items-center justify-center px-4 relative">
          <Link to={rotaVoltar} className="absolute left-4">
            <img
              src="/src/assets/sairdomodal.svg"
              alt="Voltar"
              className="w-7 h-7"
            />
          </Link>
          <h1 className="text-white text-lg font-medium">Editar Sala</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex flex-col items-center justify-start mt-10 px-4 pb-12 gap-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg px-8 py-7">
          {erro && (
            <p className="text-sm text-red-600 mb-4">{erro}</p>
          )}
          {sucesso && (
            <p className="text-sm text-green-700 mb-4">{sucesso}</p>
          )}
          {carregando && (
            <p className="text-sm text-gray-500 mb-4">Carregando dados da sala...</p>
          )}
          {!carregando && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div>
                <label className={TXT_LABEL}>Nome *</label>
                <input
                  className={CL_INPUT}
                  placeholder="Ex.: Quadra de esportes"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={salvando}
                />
              </div>

              {/* Descrição */}
              <div>
                <label className={TXT_LABEL}>Descrição *</label>
                <textarea
                  className={CL_TEXTAREA}
                  placeholder="Ex.: Espaço ao ar livre para práticas esportivas."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  disabled={salvando}
                />
              </div>

              {/* Disponibilidade / Aprovação / Capacidade */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={TXT_LABEL}>Disponibilidade *</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={`${CL_TAG_BASE} ${disponibilidade === "DISPONIVEL"
                        ? CL_TAG_ON
                        : CL_TAG_OFF
                        }`}
                      onClick={() => setDisponibilidade("DISPONIVEL")}
                      disabled={salvando}
                    >
                      Disponível
                    </button>
                    <button
                      type="button"
                      className={`${CL_TAG_BASE} ${disponibilidade === "INDISPONIVEL"
                        ? CL_TAG_ON
                        : CL_TAG_OFF
                        }`}
                      onClick={() => setDisponibilidade("INDISPONIVEL")}
                      disabled={salvando}
                    >
                      Indisponível
                    </button>
                  </div>
                </div>

                <div>
                  <p className={TXT_LABEL}>Aprovação *</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={`${CL_TAG_BASE} ${aprovacao === "MANUAL" ? CL_TAG_ON : CL_TAG_OFF
                        }`}
                      onClick={() => setAprovacao("MANUAL")}
                      disabled={salvando}
                    >
                      Manual
                    </button>
                    <button
                      type="button"
                      className={`${CL_TAG_BASE} ${aprovacao === "AUTOMATICA" ? CL_TAG_ON : CL_TAG_OFF
                        }`}
                      onClick={() => setAprovacao("AUTOMATICA")}
                      disabled={salvando}
                    >
                      Automática
                    </button>
                  </div>
                </div>

                <div>
                  <label className={TXT_LABEL}>Capacidade (qtdPessoas) *</label>
                  <input
                    type="number"
                    min={1}
                    className={CL_INPUT + " max-w-[120px]"}
                    placeholder="Ex.: 5"
                    value={qtdPessoas}
                    onChange={handleQtdChange}
                    disabled={salvando}
                  />
                </div>
              </div>

              {/* Botão Salvar Ambiente */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!formValido || salvando}
                  className={`min-w-[130px] rounded-md bg-[#B10404] text-white py-2 px-5 text-sm md:text-base shadow-sm transition-opacity ${!formValido || salvando
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-95"
                    }`}
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Seção: Adicionar/Editar Horário */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg px-8 py-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {catalogoEditando ? "Editar Horário do Catálogo" : "Adicionar Novo Horário ao Catálogo"}
            </h2>
            {catalogoEditando && (
              <button
                type="button"
                onClick={limparFormCatalogo}
                className="px-4 py-2 bg-[#B10404] text-white text-sm font-medium rounded-md hover:brightness-95 transition"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form onSubmit={handleAdicionarHorario} className="space-y-4">
            {/* Dia da Semana */}
            <div>
              <label className={TXT_LABEL}>Dia da Semana *</label>
              <select
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                className={CL_SELECT}
                disabled={salvandoCatalogo || carregando}
              >
                {DIAS_SEMANA.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hora Início / Hora Fim / Disponibilidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={TXT_LABEL}>Hora Início *</label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className={CL_INPUT}
                  disabled={salvandoCatalogo || carregando}
                />
              </div>

              <div>
                <label className={TXT_LABEL}>Hora Fim *</label>
                <input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  className={CL_INPUT}
                  disabled={salvandoCatalogo || carregando}
                />
              </div>

              <div>
                <label className={TXT_LABEL}>Disponibilidade *</label>
                <select
                  value={dispCatalogo}
                  onChange={(e) => setDispCatalogo(e.target.value)}
                  className={CL_SELECT}
                  disabled={salvandoCatalogo || carregando}
                >
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="INDISPONIVEL">Indisponível</option>
                  <option value="MANUTENCAO">Manutenção</option>
                </select>
              </div>
            </div>

            {/* Botão Adicionar/Atualizar */}
            <button
              type="submit"
              disabled={!formCatalogoValido || salvandoCatalogo || carregando}
              className={`min-w-[130px] rounded-md bg-[#B10404] text-white py-2 px-5 text-sm md:text-base shadow-sm transition-opacity ${!formCatalogoValido || salvandoCatalogo || carregando
                ? "opacity-60 cursor-not-allowed"
                : "hover:opacity-95"
                }`}
            >
              {salvandoCatalogo
                ? (catalogoEditando ? "Atualizando..." : "Adicionando...")
                : (catalogoEditando ? "Atualizar Horário" : "Adicionar Horário")}
            </button>
          </form>
        </div>

        {/* Seção: Catálogos Criados */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg px-8 py-7">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Catálogos Criados ({catalogos.length})</h2>
          </div>

          {sincronizandoCatalogos && (
            <p className="text-xs text-gray-500 mb-4">
              Sincronizando horários com os demais computadores...
            </p>
          )}

          {carregandoCatalogos ? (
            <p className="text-gray-400">Carregando...</p>
          ) : catalogos.length === 0 ? (
            <p className="text-gray-400">
              Nenhum horário cadastrado para este ambiente.
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(catalogosAgrupados).map(([dia, itens]) => (
                <div key={dia}>
                  {/* Tag do dia */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#B10404] text-white text-sm px-3 py-1 rounded-full font-medium">
                      {DIAS_LABELS[dia] || dia}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({itens.length} horário{itens.length > 1 ? "s" : ""})
                    </span>
                  </div>

                  {/* Cards de horários */}
                  <div className="space-y-3">
                    {itens.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#B10404] text-white text-xs px-2 py-1 rounded font-medium">
                              {DIAS_LABELS[cat.diaSemana] || cat.diaSemana}
                            </span>
                            <span className="text-xs px-2 py-1 rounded font-medium border"
                              style={{
                                backgroundColor:
                                  cat.disponibilidade === "DISPONIVEL"
                                    ? "#DEF7EC"
                                    : cat.disponibilidade === "MANUTENCAO"
                                      ? "#FEF3C7"
                                      : "#FEE2E2",
                                color:
                                  cat.disponibilidade === "DISPONIVEL"
                                    ? "#065F46"
                                    : cat.disponibilidade === "MANUTENCAO"
                                      ? "#92400E"
                                      : "#991B1B",
                                borderColor:
                                  cat.disponibilidade === "DISPONIVEL"
                                    ? "#A7F3D0"
                                    : cat.disponibilidade === "MANUTENCAO"
                                      ? "#FCD34D"
                                      : "#FCA5A5",
                              }}
                            >
                              {cat.disponibilidade === "DISPONIVEL"
                                ? "Disponível"
                                : cat.disponibilidade === "MANUTENCAO"
                                  ? "Manutenção"
                                  : "Indisponível"}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Início</span>
                              <span className="text-gray-900 font-medium">
                                {formatarHora(cat.horaInicio)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Fim</span>
                              <span className="text-gray-900 font-medium">
                                {formatarHora(cat.horaFim)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Duração</span>
                              <span className="text-gray-900 font-medium">
                                {calcularDuracao(
                                  formatarHora(cat.horaInicio),
                                  formatarHora(cat.horaFim)
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botões Editar e Remover */}
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleEditarCatalogo(cat)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleRemoverCatalogo(cat.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
