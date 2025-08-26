import React, { useState } from 'react';
import logoImg from '../../assets/EspacoSenai.svg';
import ondaMeioImg from '../../assets/ondadomeio.svg';

export default function NovaSenha() {
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
	};

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
						maxHeight: 64,
						minHeight: 36,
						width: 'auto',
						objectFit: 'contain',
						filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))',
					}}
				/>
			</div>

			{/* Onda do meio centralizada e responsiva */}
			<img
				src={ondaMeioImg}
				alt="Onda do meio"
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '100vw',
					height: 'auto',
					maxWidth: '100vw',
					minWidth: 320,
					zIndex: 2,
					pointerEvents: 'none',
					userSelect: 'none',
				}}
				sizes="(max-width: 600px) 100vw, 80vw"
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
					padding: '7vw 5vw 5vw 5vw',
					minWidth: 240,
					maxWidth: 550,
					width: '90vw',
                    minHeight: 235,
                    maxHeight: 450,
					textAlign: 'center',
					zIndex: 10,
				}}
			>
				<h2
					style={{
						fontSize: '33px',
						fontWeight: 400,
						marginBottom: '40px',
						marginTop: '-37px',
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
						gap: '2vw',
					}}
				>
					<div style={{ textAlign: 'left', paddingLeft: '20px' }}>
						<label style={{ fontWeight: 500, fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', color: '#222', marginBottom: 4, paddingLeft: '20px'}}>Nova Senha</label>
						<input
							type="password"
							value={senha}
							onChange={e => setSenha(e.target.value)}
							placeholder="Digite uma nova senha"
							maxLength={15}
							style={{
								width: '90%',
								height: '2.5em',
								fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
								borderRadius: '5px',
								border: 'none',
								background: '#f3f4f6',
								color: '#222',
								fontFamily: 'Poppins, Montserrat, sans-serif',
								paddingLeft: '10px',
								marginBottom: '0.3em',
								outline: 'none',
								display: 'block',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							minLength={8}
							required
						/>
						<div style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)', color: '#888', marginBottom: '0.7em', paddingLeft: '30px' }}>no mínimo 5 dígitos</div>
					</div>
					<div style={{ textAlign: 'left', paddingLeft: '20px' }}>
						<label style={{ fontWeight: 500, fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', color: '#222', marginBottom: 4, paddingLeft: '20px' }}>Confirme a senha</label>
						<input
							type="password"
							value={confirma}
							onChange={e => setConfirma(e.target.value)}
							placeholder="Confirme a senha"
							maxLength={15}
							style={{
								width: '90%',
								height: '2.5em',
								fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
								borderRadius: '5px',
								border: 'none',
								background: '#f3f4f6',
								color: '#222',
								fontFamily: 'Poppins, Montserrat, sans-serif',
								paddingLeft: '10px',
								outline: 'none',
								display: 'block',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							required
						/>
					</div>
					{erro && <div style={{ color: '#b91c1c', fontSize: 'clamp(0.9rem, 1vw, 1rem)', marginBottom: '0.7em' }}>{erro}</div>}
					<button
						type="submit"
						style={{
							width: '40%',
							height: '2.5em',
							background: '#b91c1c',
							color: '#fff',
							borderRadius: '10px',
							fontWeight: 500,
							fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
							fontFamily: 'Poppins, sans-serif',
							boxShadow: '0 4px 16px 0 rgba(0,0,0,0.12)',
							border: 'none',
							cursor: 'pointer',
							transition: 'background 0.2s',
							alignSelf: 'center',
							marginTop: '1vw',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onMouseOver={e => e.currentTarget.style.background = '#991b1b'}
						onMouseOut={e => e.currentTarget.style.background = '#b91c1c'}
					>
						Salvar
					</button>
				</form>
			</div>
		</div>
	);
}
