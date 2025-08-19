import React, { useRef } from 'react';
import logoImg from '../assets/EspacoSenai.svg';
import ondaLateralImg from '../assets/onda lateral.svg';
import ondaMenorImg from '../assets/onde menor.svg';

export default function CodigoDeRec() {
	const inputsRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

	// Move para o próximo input ao digitar
	const handleInput = (e, idx) => {
		let value = e.target.value.toUpperCase();
		// Permitir apenas letras maiúsculas e números
		value = value.replace(/[^A-Z0-9]/g, '');
		e.target.value = value;
		if (value.length === 1 && idx < 5) {
			inputsRef[idx + 1].current.focus();
		}
		if (value.length === 0 && idx > 0) {
			inputsRef[idx - 1].current.focus();
		}
	};

	return (
		<div style={{
			minHeight: '100vh',
			width: '100vw',
			background: '#f7f7f7',
			position: 'relative',
			fontFamily: 'Poppins, sans-serif',
			overflow: 'hidden',
			boxSizing: 'border-box',
		
		}}>
			  {/* Logo no canto superior esquerdo */}
                  <div className="absolute top-4 left-4 z-10">
                    <img
                      src={logoImg}
                      alt="EspaçoSenai Logo"
                      className="h-12 sm:h-16 w-auto object-contain drop-shadow"
                    />
                  </div>

			{/* Onda lateral - Responsiva */}
                  <div className="absolute top-0 right-0 h-full w-1/2 md:w-1/3 z-0 overflow-hidden">
                    <img
                      src={ondaLateralImg}
                      alt="Onda decorativa lateral"
                      className="h-full w-full object-cover object-left transform scale-150 md:scale-100"
                    />
                  </div>

			 {/* Onda menor - Inferior esquerda, responsiva e grande */}
                  <img
                    src={ondaMenorImg}
                    alt="Onda decorativa menor"
                    className="fixed left-0 bottom-0 z-0 select-none pointer-events-none"
                    style={{
                      width: 'min(40vw, 600px)',
                      minWidth: '200px',
                      maxWidth: '100vw',
                      height: 'auto',
                      opacity: 0.9
                    }}
                  />
			{/* Card central */}
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				background: '#fff',
				borderRadius: 14,
				boxShadow: '0 4px 16px 0 rgba(0,0,0,0.12)',
				padding: '38px 38px 28px 38px',
				minWidth: 390,
				maxWidth: 500,
				width: '90%',
				minHeight: 235,
				textAlign: 'center',
			
				zIndex: 10
			}}>
				<h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 28, color: '#222', fontFamily: 'Montserrat, Poppins, sans-serif' }}>
					Insira seu código de verificação
				</h2>
                
				<div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
					{[0,1,2,3,4,5].map((idx) => (
						<input
							key={idx}
							ref={inputsRef[idx]}
							type="text"
							maxLength={1}
							onInput={e => handleInput(e, idx)}
							style={{
								width: 48,
								height: 48,
								fontSize: 28,
								textAlign: 'center',
								border: '2px solid #b91c1c',
								borderRadius: 8,
								background: '#fff',
								color: '#111',
								outline: 'none',
								fontFamily: 'Poppins, Montserrat, sans-serif',
								boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
								transition: 'border 0.2s',
							}}
							autoFocus={idx === 0}
						/>
					))}
				</div>
				<div style={{ fontSize: 13, color: '#444', marginTop: 30 }}>
					<span style={{ fontWeight: 600 }}>Não recebeu o código?</span> <a href="#" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>Reenvia-lo</a>
				</div>
			</div>
		</div>
	);
}
