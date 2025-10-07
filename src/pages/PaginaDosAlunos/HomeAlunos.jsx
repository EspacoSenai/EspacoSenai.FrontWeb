import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaPrincipal from "../../assets/OndasHome.svg";
import OndaRodape from "../../assets/ondaPrincipal.svg";
import Pessoa from "../../assets/HomeMulher.svg";

const COR = "#AE0000";

const destaques = [
  {
    id: "quadra",
    titulo: "Quadra",
    descricao:
      "Agende a quadra para treinos, recreação e eventos internos da escola.",
    imagem: "/assets/home/quadra.jpg",
    link: "/agendamento-quadra",
    badge: "Destaque",
  },
  {
    id: "ps5",
    titulo: "PS5",
    descricao:
      "Partidas rápidas ou torneios entre amigos na sala de entretenimento.",
    imagem: "/assets/home/ps5.jpg",
    link: "/agendamento-ps5",
    badge: "Novo",
  },
  {
    id: "computadores",
    titulo: "Computadores",
    descricao:
      "Reserve um computador para estudos, projetos e pesquisas.",
    imagem: "/assets/home/computadores.jpg",
    link: "/agendamento-computadores",
    badge: "Essencial",
  },
];

const laboratorios = [
  { id: 1, titulo: "Lab. Informática 1", imagem: "/assets/home/lab1.jpg" },
  { id: 2, titulo: "Lab. Informática 2", imagem: "/assets/home/lab2.jpg" },
  { id: 3, titulo: "Sala de Estudo", imagem: "/assets/home/estudo.jpg" },
  { id: 4, titulo: "Quadra Coberta", imagem: "/assets/home/quadra2.jpg" },
  { id: 5, titulo: "Sala de Jogos", imagem: "/assets/home/jogos.jpg" },
  { id: 6, titulo: "Auditório", imagem: "/assets/home/auditorio.jpg" },
];

function CardDestaque({ item }) {
  return (
    <div className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="h-36 bg-gray-100">
        <img
          src={item.imagem}
          alt={item.titulo}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
          {item.badge && (
            <span
              className="px-2 py-0.5 rounded text-xs text-white"
              style={{ backgroundColor: COR }}
            >
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{item.descricao}</p>
        <Link
          to={item.link}
          className="inline-block mt-3 px-4 py-2 rounded-md text-white text-sm"
          style={{ backgroundColor: COR }}
        >
          Agendar
        </Link>
      </div>
    </div>
  );
}

function DestaquesCarousel() {
  const ref = React.useRef(null);
  const scrollBy = (dx) =>
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Espaços em Destaque
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-340)}
            className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
            aria-label="Anterior"
          >
            <img src="/assets/icons/chevron-left.svg" alt="" className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(340)}
            className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
            aria-label="Próximo"
          >
            <img src="/assets/icons/chevron-right.svg" alt="" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 pr-1 custom-scroll"
      >
        {destaques.map((d) => (
          <CardDestaque key={d.id} item={d} />
        ))}
      </div>
    </section>
  );
}

function CardLaboratorio({ item }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="h-28 bg-gray-100">
        <img
          src={item.imagem}
          alt={item.titulo}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <h4 className="font-medium text-gray-900 text-sm">{item.titulo}</h4>
        <span
          className="text-[11px] px-2 py-0.5 rounded text-white"
          style={{ backgroundColor: COR }}
        >
          Disponível
        </span>
      </div>
    </div>
  );
}

export default function HomeAlunos() {
  return (
    <main className="bg-white overflow-hidden">
      <Header />

      {/* HERO */}
      <section className="relative flex flex-col md:flex-row items-center justify-between w-full pt-24 pb-16 px-6 md:px-12 overflow-hidden">
        {/* Fundo com a onda principal */}
        <img
          src={OndaPrincipal}
          alt="Fundo com ondas vermelhas"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          style={{ objectPosition: "center top" }}
        />

        {/* Texto e botão */}
        <div className="w-full md:w-1/2 text-center md:text-left text-white relative z-10">
          <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
            Bem-Vindo(a) <span className="font-bold">Nome</span>,
          </h1>
          <p className="text-lg md:text-xl mt-1">Esta é a página principal!</p>
          <Link
            to="/agendamento-quadra"
            className="inline-block mt-5 px-5 py-3 rounded-md text-[#AE0000] bg-white font-medium hover:opacity-90 transition"
          >
            Reserve agora
          </Link>
        </div>

        {/* Imagem da mulher */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 relative z-10">
          <img
            src={Pessoa}
            alt="Ilustração mulher"
            className="w-64 sm:w-72 md:w-96 object-contain"
          />
        </div>
      </section>

      {/* DESTAQUES */}
      <div id="destaques" className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <DestaquesCarousel />
      </div>

      {/* LABORATÓRIOS */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 my-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Laboratórios</h2>
          <Link
            to="/landing#laboratorios"
            className="text-sm underline underline-offset-4"
            style={{ color: COR }}
          >
            ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {laboratorios.map((lab) => (
            <CardLaboratorio key={lab.id} item={lab} />
          ))}
        </div>
      </section>

      {/* QUEM PODE RESERVAR */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 my-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quem pode reservar?
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Alunos do SENAI que tiverem cadastro no nosso site.</li>
            <li>Docentes e coordenadores para preparação de aula.</li>
          </ul>

          <p className="mt-4 text-sm text-gray-700">
            <span className="font-semibold" style={{ color: COR }}>
              OBS:
            </span>{" "}
            Todas as reservas seguem as regras pedagógicas e operacionais definidas pela unidade.
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Saiba mais sobre o SENAI Suíço-Brasileira na página institucional.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <div
            className="rounded-2xl p-8 text-white"
            style={{ backgroundColor: COR }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">
                Pronto para fazer sua reserva?
              </h3>
              <div className="flex flex-wrap justify-center md:justify-end gap-3">
                <Link
                  to="/agendamento-quadra"
                  className="px-5 py-3 rounded-md bg-white text-gray-900"
                >
                  Agendar Quadra
                </Link>
                <Link
                  to="/agendamento-computadores"
                  className="px-5 py-3 rounded-md bg-white text-gray-900"
                >
                  Agendar Computadores
                </Link>
                <Link
                  to="/agendamento-ps5"
                  className="px-5 py-3 rounded-md bg-white text-gray-900"
                >
                  Agendar PS5
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onda do rodapé */}
      <img
        src={OndaRodape}
        alt="Onda do rodapé"
        className="w-full h-auto object-cover -mb-[5px]"
      />

      <Footer />
    </main>
  );
}
