import React from 'react';
import { useNavigate } from 'react-router-dom';
import setaLeft from '../../assets/setaleft.svg';
import avatarImg from '../../assets/avatar.svg';
import iconeEditar from '../../assets/editarperfil.svg';
import lapis from '../../assets/lápis.svg';

export default function EditarPerfil() {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-white font-sans">

      {/* Header */}
      <div className="relative flex items-center justify-center px-3 py-3 border-b border-gray-200">

        {/* Seta maior e alinhada no canto */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-0"
          aria-label="Voltar"
        >
          <img src={setaLeft} alt="Voltar" className="w-9 h-8" />
    </button>
  <h1 className="text-lg font-medium w-full text-center pointer-events-none text-black">Editar Perfil</h1>
    <img
          src={iconeEditar}
          alt="Editar perfil"
          className="absolute right-8 top-3 w-9 h-7"
        />
      </div>

  {/* Faixa vermelha no topo */}
  <div className="w-full h-20 bg-[#7a0d0d]" />

  <main className="max-w-xl mx-auto px-6 py-8">

        {/* Avatar sem círculo de fundo (centralizado) */}
  <div className="flex flex-col items-center mb-12 -mt-20">
          <img src={avatarImg} alt="Avatar" className="w-28 h-28 object-cover mb-3 rounded-full shadow" />
          <button style={{ borderRadius: '10px' }} className="bg-[#b91c1c] text-white px-4 py-1 text-sm mt-1 shadow-md w-22 text-center">
            Mudar Avatar
          </button>
        </div>

        {/* Formulário alinhado à esquerda, campos simples */}
  <form className="flex flex-col gap-8 items-start w-full">
          <div className="w-full">
            <label htmlFor="nome" className="text-sm font-medium mb-1 block text-black text-left">Nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome do usuário"
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            />
          </div>

          <div className="w-full relative">
            <label htmlFor="email" className="text-sm font-medium mb-1 block text-black text-left">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="rounded-lg p-3 w-full text-black bg-[#EEEEEE]"
            />
            <img src={lapis} alt="Editar email" className="w-5 h-5 absolute right-3 top-12 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="w-full">
            <label htmlFor="senha" className="text-sm font-medium mb-1 block text-black text-left">Senha:</label>
                <button id="senha" type="button" className="text-black font-normal text-sm px-7 py-2 rounded-md bg-[#EEEEEE] mt-1 block">
                Alterar senha
              </button>
          </div>

          <button
            type="submit"
            className="bg-[#b91c1c] text-white px-5 py-1 rounded-md ml-auto mt-4 transform translate-x-20"
          >
            Salvar Perfil
          </button>
        </form>
      </main>
    </div>
  );
}
