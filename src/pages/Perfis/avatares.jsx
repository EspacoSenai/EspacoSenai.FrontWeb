import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import setaLeft from '../../assets/setaleft.svg';
import avatar1 from '../../assets/avatar1.svg';
import avatar2 from '../../assets/avatar2.svg';
import avatar3 from '../../assets/avatar3.svg';
import avatar4 from '../../assets/avatar4.svg';
import avatar5 from '../../assets/avatar5.svg';
import avatar6 from '../../assets/avatar6.svg';
import avatar7 from '../../assets/avatar7.svg';
import avatar8 from '../../assets/avatar8.svg';
import avatar9 from '../../assets/avatar9.svg';
import avatar10 from '../../assets/avatar10.svg';
import avatar11 from '../../assets/avatar11.svg';
import semAvatar from '../../assets/semAvatar.svg';

const avatars = [
  { id: 'avatar1', src: avatar1 },
  { id: 'avatar2', src: avatar2 },
  { id: 'avatar3', src: avatar3 },
  { id: 'avatar4', src: avatar4 },
  { id: 'avatar5', src: avatar5 },
  { id: 'avatar6', src: avatar6 },
  { id: 'avatar7', src: avatar7 },
  { id: 'avatar8', src: avatar8 },
  { id: 'avatar9', src: avatar9 },
  { id: 'avatar10', src: avatar10 },
  { id: 'avatar11', src: avatar11 },
  { id: 'semAvatar', src: semAvatar },
];

export default function Avatares() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  function handleConfirm() {
    // For now just log; you can replace with save logic
    console.log('selected avatar:', selected);
    // navigate back or close modal
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="relative flex items-center justify-center px-3 py-3 border-b border-gray-200">
  <button onClick={() => navigate(-1)} className="absolute left-1 top-1" aria-label="Voltar">
          <img src={setaLeft} alt="Voltar" className="w-9 h-7" />
        </button>
  <h1 className="text-black text-xl font-medium">Avatar</h1>
      </div>

      {/* Description band */}
      <div className="w-full bg-[#7a0d0d] text-white text-center px-6 py-4">
        <p className="max-w-2xl mx-auto text-lg leading-relaxed">
          Você pode escolher o avatar que será usado como sua foto de<br/>
          perfil. Selecione aquele que mais combina com você e personalize<br/>
          a sua experiência!
        </p>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
    <div className="grid grid-cols-3 gap-8">
          {avatars.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a.id)}
              className={`flex items-center justify-center h-40 w-40 bg-[#D1D5DB] rounded-lg shadow-sm relative ${selected === a.id ? 'ring-4 ring-[#b91c1c] scale-105' : ''}`}
            >
      <img src={a.src} alt={a.id} className="w-32 h-32 object-cover rounded-full" />
            </button>
          ))}
        </div>

  <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selected}
            className={`bg-[#b91c1c] text-white px-6 py-1.5 rounded-md ${!selected ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            Confirmar
          </button>
        </div>
      </main>
    </div>
  );
}
