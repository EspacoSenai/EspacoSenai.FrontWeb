import React from 'react';
import sino from '../assets/sem-notificacoes-1.svg';
import setaLeft from '../assets/setaleft.svg';
import sinodenoti from '../assets/sinodenoti.svg';

export default function SemNotificacao() {
	return (
		<div className="min-h-screen w-screen bg-white font-sans flex flex-col items-center box-border p-0">
			{/* Barra superior */}
					{/*
						topBar: Container superior com botão de voltar à esquerda
						- w-full: ocupa toda a largura
						- flex items-center: centraliza verticalmente os itens
						- pt-6 pl-6: espaçamento superior e à esquerda
						- relative: necessário para posicionar o título central com absolute
					*/}
					<div className="w-full flex items-center justify-start pt-6 pl-6 relative">
						{/*
							backButton: botão no fluxo normal (à esquerda)
							- bg-transparent border-0: botão sem fundo e sem borda
							- p-0 flex items-center: alinha o ícone
						*/}
						<button className="bg-transparent border-0 p-0 flex items-center cursor-pointer" onClick={() => window.history.back()}>
					<img src={setaLeft} alt="Voltar" className="w-8 h-8 block" />
				</button>
						{/*
							titleContainer: centraliza o título horizontalmente usando absolute
							- absolute inset-x-0: ocupa toda a largura entre left/right para centralizar
							- flex justify-center: centraliza o conteúdo
							Dica: se quiser que o título não capture eventos do botão, use pointer-events-none aqui
						*/}
					<div className="absolute inset-x-0 flex justify-center transform -translate-x-3">
							<div className="inline-flex items-center font-medium text-[#222]" style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>
								<img src={sinodenoti} alt="Ícone de notificação" className="w-5 h-5 mr-2 block" />
								<span className="relative inline-block text-[1.15rem]">
									<span>Suas notificações</span>
									<span className="absolute left-0 -bottom-0.5 w-full" style={{ height: 2, background: '#7c0c15' }} />
								</span>
							</div>
						</div>
			</div>

			{/* Conteúdo central */}
			{/*
				Central container: usamos um container com max-width para que o conteúdo do meio
				fique alinhado exatamente com o título centralizado acima.
				- w-full max-w-[640px] mx-auto: deixa o conteúdo centralizado e limita a largura
				- flex flex-col items-center: organiza itens verticalmente e centraliza horizontalmente
			*/}
			<div className="flex-1 w-full flex items-center justify-center p-5 pb-10">
				<div className="w-full max-w-[720px] mx-auto flex flex-col items-center">
					{/* Bell image: ocupa largura responsiva dentro do container central */}
					<div className="flex items-center justify-center mt-10 mb-9 w-full">
						<img src={sino} alt="Sino dormindo" className="block mx-auto" style={{ width: 'min(50vw, 320px)', height: 'auto' }} />
					</div>

					{/* Text block: usa a mesma largura do container para alinhamento perfeito */}
					<div className="text-center w-full px-4">
						  <h2 className="font-semibold text-[#222] mb-6" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}>Tudo tranquilo por aqui!</h2>
						  <div className="font-medium text-[#222] mb-3" style={{ fontSize: '1rem' }}>Parece que você não tem nenhuma notificação no momento.</div>
						{/*
							- whitespace-normal: permite quebra normal de linhas (não força nowrap)
							- break-words: evita que palavras longas sejam cortadas com overflow; quebra quando necessário
							- pb-10 no container garante espaço inferior caso o texto ocupe várias linhas
						*/}
						<div className="font-normal text-[#222] whitespace-normal break-words leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 2vw, 1rem)' }}>
							Avisaremos por aqui assim que houver novidades ou novos agendamentos!
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
{/* esta comentado para deixar mais fácil de entender o conceito/lógica do projeto e permitir mais flexibilidade na edição futura */}
