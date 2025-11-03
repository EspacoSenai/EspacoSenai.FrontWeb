import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/Home/HeaderGlobal";
import Footer from "../PageIniciais/footer";

import OndaTopo from "../../assets/ondaLandinpage.svg";
import AvatarDefault from "../../assets/AvatarPadrao.svg";

import ImgPS5 from "../../assets/FotoPs5.svg";
import ImgQuadra from "../../assets/FotoQuadra.svg";
import ImgComputadores from "../../assets/Computadores.svg";
import ImgImpressora3D from "../../assets/Impressora3D.svg";

const COR = "#AE0000";

export default function SalasAlunos() {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const a = localStorage.getItem("avatar_url");
    setAvatar(a && a !== "null" && a !== "undefined" ? a : null);
  }, []);

  const cards = [
    {
      id: "ps5",
      title: "PS5",
      img: ImgPS5,
      desc:
        "Agora você pode aproveitar toda a emoção dos games com o PlayStation 5 na biblioteca.",
      to: "/agendamento-ps5",
    },
    {
      id: "quadra",
      title: "Quadra",
      img: ImgQuadra,
      desc:
        "A quadra é um espaço essencial para a prática de esportes, lazer e atividades físicas.",
      to: "/agendamento-quadra",
    },
    {
      id: "computadores",
      title: "Computadores",
      img: ImgComputadores,
      desc:
        "A biblioteca oferece computadores avançados para otimizar sua produtividade.",
      to: "/agendamento-computadores",
    },
    {
      id: "impressoras3d",
      title: "Impressoras 3D",
      img: ImgImpressora3D,
      desc:
        "As impressoras 3D permitem criar protótipos e peças personalizadas com inovação.",
      to: "/agendamento-impressao-3d",
    },
  ];

  return (
    <>
      <Header />

      <main className="bg-white dark:bg-[#1E1E1E] min-h-screen overflow-hidden relative">
       
        <motion.img
          src={OndaTopo}
          alt="Onda landingpage"
          className="w-full h-auto object-cover select-none pointer-events-none"
          initial={{ y: 12 }}
          animate={{ y: [12, 2, 12] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        />

        
        <section className="relative -mt-6 sm:-mt-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto bg-white dark:bg-[#121212] ring-1 ring-black/10 dark:ring-white/10 overflow-hidden shadow-sm">
              <img
                src={avatar || AvatarDefault}
                alt="Avatar do usuário"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-center text-[12px] sm:text-[13px] text-[#1E1E1E] dark:text-white">
              Aluna
            </p>
          </div>
        </section>

        {/* Faixa vermelha */}
        <section className="mt-4">
          <div className="bg-[#B10000] text-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-6 sm:py-7 text-center">
              <h2 className="text-[15px] sm:text-[17px] md:text-[18px] font-semibold">
                Encontre o espaço perfeito, reserve em minutos!
              </h2>
              <p className="mt-3 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed opacity-95">
                Descubra uma curadoria de locais únicos e versáteis, prontos para
                receber seu próximo encontro.
              </p>
              <p className="mt-1 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed opacity-95">
                Agende com confiança e dê vida aos seus momentos memoráveis.
              </p>
            </div>
          </div>
        </section>

        
        <section className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-6 pb-20 md:pb-24">
          {/* Cabeçalho "Agendar" com underline */}
          <div className="grid place-items-center">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-[#1E1E1E] dark:text-white">
                Agendar
              </h3>
              <div
                className="mt-1 h-[3px] w-14 mx-auto rounded-full"
                style={{ backgroundColor: COR }}
              />
            </div>
          </div>

          {/* Grid de cards — estreitos e centrados */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((c) => (
              <article
                key={c.id}
                className="
                  mx-auto max-w-[360px]
                  rounded-xl bg-white dark:bg-[#151515]
                  border border-black/10 dark:border-white/10
                  shadow-sm"
              >
                <div className="p-4">
                  {/* Imagem */}
                  <div className="h-[130px] w-full rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Título (badge) + descrição */}
                  <div className="mt-3">
                    <span className="inline-block text-[11px] font-semibold bg-[#B10000] text-white px-2 py-[2px] rounded">
                      {c.title}
                    </span>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#1E1E1E] dark:text-gray-200">
                      {c.desc}
                    </p>
                  </div>

                  {/* Botão – compacto, centralizado */}
                  <div className="mt-3 flex justify-center">
                    <Link to={c.to} className="inline-flex">
                      <button
                        className="
                          px-6 h-8 rounded-md text-white text-[13px] font-semibold
                          shadow-sm hover:brightness-[.98] active:scale-[.99] transition"
                        style={{ backgroundColor: COR }}
                      >
                        Agendar
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
