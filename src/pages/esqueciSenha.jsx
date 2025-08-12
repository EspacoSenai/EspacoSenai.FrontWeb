import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/EspacoSenai.svg';
import ondaLateralImg from '../assets/onda lateral.svg';
import ondaMenorImg from '../assets/onde menor.svg';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implementar a lógica de envio do código de verificação
    console.log('Enviando código para:', email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-white overflow-hidden">
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

      {/* Logo no canto superior esquerdo */}
      <div className="absolute top-4 left-4 z-10">
        <img
          src={logoImg}
          alt="EspaçoSenai Logo"
          className="h-12 sm:h-16 w-auto object-contain drop-shadow"
        />
      </div>

      {/* Container principal - Responsivo */}
      <div className="w-full max-w-[90%] sm:max-w-md px-4 sm:px-6 py-4 sm:py-8 z-10 flex flex-col items-center justify-center">
        {/* Card branco - Responsivo */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
            padding: '2rem 1.5rem',
            width: '100%'
          }}
        >
          <p
            style={{
              textAlign: 'center',
              color: '#111',
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 8
            }}
          >Esqueceu a senha?</p>
          <h1
            style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 40,
              marginBottom: 16
            }}
          >Esqueceu a senha?</h1>
          <p
            style={{
              color: '#000',
              marginBottom: 50,
              marginTop: -40, // Ajuste aqui para subir mais ou menos
              width: '100%',
              textAlign: 'center'
            }}
          >Vamos enviar um código de verificação por <br />email
           para você criar uma nova senha.</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              width: 290,
              borderRadius: 10,
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              alignItems: 'center',
              margin: '0 auto'
            }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontWeight: 400,
                color: '#111',
                fontSize: 17,
                marginBottom: 8,
                marginLeft: 0, 
                marginTop: 0,  
                width: 260,   
                textAlign: 'left'
              }}>Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                style={{
                  width: 260,
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  color: '#111',
                  borderRadius: 8,
                  border: 'none',
                  outline: 'none',
                  fontSize: 16,
                  marginBottom: 0,
                  marginLeft: 0,
                  display: 'block',
                  paddingLeft: 10 
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: 180,
                background: '#b91c1c',
                color: '#fff',
                padding: '8px 0',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                alignSelf: 'center',
                marginTop: 8
              }}
              onMouseOver={e => e.currentTarget.style.background = '#991b1b'}
              onMouseOut={e => e.currentTarget.style.background = '#b91c1c'}
            >
              Enviar código
            </button>
          </form>
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <span style={{ color: '#111' }}>Voltar ao </span>
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 400 }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EsqueciSenha;