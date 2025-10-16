import React, { useState } from 'react';
import '../index.css';
import Logo from '../assets/EspacoSenai.svg';
import Onda from '../assets/ondauser.svg';

export default function CriarUsuario() {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [cargo, setCargo] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		// Simulação de envio - aqui eu só troco por chamada a API 
		console.log('Criar usuário', { nome, email, cargo });
		alert('Usuário criado com sucesso (simulação)');
	}

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			{/* Cabeçalho com logo */}
			<header className="flex items-start justify-start px-4 sm:px-6 md:px-8 pt-2 md:pt-4">
				<img src={Logo} alt="Espaço Senai" className="w-28 sm:w-32 md:w-40 h-auto" />
			</header>

			{/* Conteúdo central */}
			<main className="relative flex-1 flex items-start justify-center px-4 pt-4 md:pt-6 lg:pt-8 overflow-hidden">
				{/* Onda decorativa no canto inferior direito */}
				<img
					src={Onda}
					alt="onda decorativa"
					aria-hidden="true"
					className="pointer-events-none select-none absolute right-0 bottom-0 w-[140%] md:w-[120%] lg:w-[100%] h-auto object-contain opacity-100 z-0 -right-48 -bottom-24"
				/>
				<div className="relative w-full max-w-xs sm:max-w-xs md:max-w-sm lg:max-w-sm z-10 -mt-10 md:-mt-16 lg:-mt-20">

					{/* Formulário centralizado */}
					<form	
						onSubmit={handleSubmit}
						className="relative bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-5 md:p-6 mx-auto w-full sm:max-w-xs md:max-w-sm z-10"
						aria-label="Formulário criar usuário"
					>
						<h1 className="text-center text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-black">Criar Usuário</h1>
						<div className="space-y-4 md:space-y-5">
							<input
								id="nome"
								aria-label="Nome"
								type="text"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
								placeholder="Nome"
								className="block w-full rounded-md border-0 shadow-md px-3 py-2 bg-white text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
								required
							/>

							<input
								id="email"
								aria-label="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								className="block w-full rounded-md border-0 shadow-md px-3 py-2 bg-white text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
								required
							/>

							<select
								id="cargo"
								aria-label="Cargo"
								value={cargo}
								onChange={(e) => setCargo(e.target.value)}
								className="block w-full rounded-md border-0 shadow-md px-3 py-2 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
								required
							>
								<option value="" className="text-black">Cargo</option>
								<option value="aluno" className="text-black">Aluno</option>
								<option value="instrutor" className="text-black">Instrutor</option>
								<option value="administrador" className="text-black">Administrador</option>
							</select>
						</div>

						<div className="flex justify-center mt-5">
							<button
								type="submit"
								className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-600 transition text-sm sm:text-base shadow-md"
							>
								Criar
							</button>
						</div>
					</form>
				</div>
			</main>


			{/* Media query personalizada para ajustes específicos */}
			<style>{`
				@media (max-width: 640px) {
					form {
						width: 100%;
						max-width: 100%;
						margin: 0 auto;
					}
				}
				
				@media (min-width: 768px) {
					form {
						box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
					}
				}
				
				@media (min-width: 1024px) {
					form {
						max-width: 450px;
					}
				}
			`}</style>
		</div>
	);
}
