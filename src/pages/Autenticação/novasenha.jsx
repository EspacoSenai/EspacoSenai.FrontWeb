import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/EspacoSenai.svg';
import ondaMeioImg from '../../assets/ondadomeio.svg';

export default function NovaSenha() {
	const navigate = useNavigate();
	const [senha, setSenha] = useState('');
	const [confirma, setConfirma] = useState('');
	const [erro, setErro] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (senha.length < 5) {
			setErro('A senha deve ter no mínimo 5 dígitos.');
			return;
		}
		if (senha.length > 15) {
			setErro('A senha deve ter no máximo 15 dígitos.');
			return;
		}
		if (senha !== confirma) {
			setErro('As senhas não coincidem.');
			return;
		}
		setErro('');
		alert('Senha alterada com sucesso!');
		navigate('/login');
	};

	const finishAndGoLogin = () => navigate('/login');

	return (
		<div
			style={{
				minHeight: '100vh',
				width: '100vw',
				background: '#f7f7f7',
				position: 'relative',
				fontFamily: 'Poppins, sans-serif',
				overflow: 'hidden',
				boxSizing: 'border-box',
			}}
		>
			{/* Logo responsivo no topo */}
			<div
				style={{
					position: 'absolute',
					top: '2vw',
					left: '2vw',
					zIndex: 10,
				}}
			>
				<img
					src={logoImg}
					alt="EspaçoSenai Logo"
					style={{
						height: '7vw',
						maxHeight: 80,
						minHeight: 36,
						width: 'auto',
						objectFit: 'contain',
						filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))',
					}}
				/>
			</div>

			{/* Onda centralizada */}
			<img
				src={ondaMeioImg}
				alt=""
				aria-hidden="true"
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					width: '100vw',        
					minWidth: '100vw',
					maxWidth: '100vw',
					height: 'auto',
					zIndex: 1,
					pointerEvents: 'none',
					userSelect: 'none',
				}}
			/>

			{/* Card central responsivo */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					background: '#fff',
					borderRadius: '13px',
					boxShadow: '0 4px 16px 0 rgba(0,0,0,0.12)',
					padding: 'clamp(16px, 4vw, 32px) clamp(16px, 5vw, 40px) clamp(16px, 4vw, 28px) clamp(16px, 5vw, 40px)',
					minWidth: 240,
					maxWidth: 550,
					width: '90vw',
					minHeight: 235,
					maxHeight: '85vh',
					textAlign: 'center',
					zIndex: 10,
					boxSizing: 'border-box',
					overflowY: 'auto',  
					WebkitOverflowScrolling: 'touch',
				}}
			>
				{/* Conteúdo ) */}
				<div>
					<h2
						style={{
							fontSize: 'clamp(22px, 3.2vw, 30px)',
							fontWeight: 400,
							marginBottom: 'clamp(16px, 3vw, 24px)',
							marginTop: 0,
							color: '#222',
							fontFamily: 'Montserrat, Poppins, sans-serif',
						}}
					>
						Escolha sua nova Senha
					</h2>

					<form
						onSubmit={handleSubmit}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'clamp(12px, 2vw, 20px)',
						}}
					>
						<div style={{ textAlign: 'left' }}>
							<label
								style={{
									fontWeight: 500,
									fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
									color: '#222',
									marginBottom: 4,
									paddingLeft: '8px',
								}}
							>
								Nova Senha
							</label>
							<input
								type="password"
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								placeholder="Digite uma nova senha"
								maxLength={15}
								style={{
									width: '100%',
									maxWidth: 480,
									height: 44,
									fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
									borderRadius: 6,
									border: 'none',
									background: '#f3f4f6',
									color: '#222',
									fontFamily: 'Poppins, Montserrat, sans-serif',
									padding: '0 12px',
									margin: '4px auto 8px',
									outline: 'none',
									display: 'block',
									boxSizing: 'border-box',
								}}
								minLength={8}
								required
							/>
							<div
								style={{
									fontSize: 'clamp(0.8rem, 1vw, 1rem)',
									color: '#888',
									paddingLeft: '8px',
								}}
							>
								no mínimo 8 dígitos
							</div>
						</div>

						<div style={{ textAlign: 'left' }}>
							<label
								style={{
									fontWeight: 500,
									fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
									color: '#222',
									marginBottom: 4,
									paddingLeft: '8px',
								}}
							>
								Confirme a senha
							</label>
							<input
								type="password"
								value={confirma}
								onChange={(e) => setConfirma(e.target.value)}
								placeholder="Confirme a senha"
								maxLength={15}
								style={{
									width: '100%',
									maxWidth: 480,
									height: 44,
									fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
									borderRadius: 6,
									border: 'none',
									background: '#f3f4f6',
									color: '#222',
									fontFamily: 'Poppins, Montserrat, sans-serif',
									padding: '0 12px',
									margin: '4px auto 0',
									outline: 'none',
									display: 'block',
									boxSizing: 'border-box',
								}}
								required
							/>
						</div>

						{erro && (
							<div
								style={{
									color: '#b91c1c',
									fontSize: 'clamp(0.9rem, 1vw, 1rem)',
								}}
							>
								{erro}
							</div>
						)}

						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<button
								type="submit"
								className="bg-[#B10404] text-white rounded-md transform transition-transform duration-200 hover:scale-105"
								style={{
									width: 170,
									height: 40,
									padding: '8px 12px',
									fontSize: 14,
									lineHeight: 1,
									borderRadius: 6,
								}}
							>
								Salvar nova senha
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
