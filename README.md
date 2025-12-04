# EspaçoSenai – Frontend Web

Aplicação web para gerenciamento de reservas de espaços no SENAI Suíço-Brasileira "Paulo Ernesto Tolle", como quadra, PS5, laboratórios de computadores, impressoras 3D e auditório.  
O foco do projeto é oferecer uma experiência simples e acessível para alunos, professores e coordenação realizarem agendamentos de forma organizada.

---
````
## ✨ Funcionalidades

- **Autenticação** via JWT (token salvo no `localStorage`).
- **Perfil do usuário**
  - Exibição de avatar (ou avatar padrão);
  - Nome do usuário carregado do backend (`/usuario/meu-perfil`).
- **Turmas do aluno**
  - Listagem de turmas em que o aluno está matriculado (`/usuario/minhas-turmas`);
  - Exibição de nome da turma, curso, professor e código de acesso.
- **Entrar em turma por código**
  - Formulário para ingressar com código enviado pelo professor;
  - Mensagens de sucesso/erro tratadas diretamente do backend.
- **Agendamento de espaços**
  - PS5  
  - Quadra  
  - Computadores  
  - Impressoras 3D  
  - Auditório  
- **Regras de agendamento**
  - Horários e dias disponíveis são carregados do endpoint `/catalogo/buscar`;
  - Bloqueio de horários já passados no dia atual;
  - Verificações de intervalo de início e término;
  - Mensagens claras em caso de erro de configuração ou conflito.
- **Dark mode** (via classes `dark:` do Tailwind);
- **Animações suaves** com Framer Motion (cards, ondas, etc).

````
---

## 🧰 Tecnologias utilizadas

- React
- React Router DOM
- Vite (se aplicável ao repo)
- Tailwind CSS
- Framer Motion
- Axios (consumo da API do backend – Java / Spring Boot)

---

## 📦 Dependências principais

Algumas libs que provavelmente estão no `package.json`:

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `framer-motion`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `@vitejs/plugin-react-swc` (caso use Vite)
- Outras dependências de UI/ícones se o projeto usar

---

## 📁 Estrutura (resumo)

Algumas pastas importantes do projeto:

src/
 ├─ assets/                     # Imagens, ícones, ondas, avatares, etc.
 ├─ components/
 │   ├─ Home/
 │   │   └─ HeaderGlobal.jsx    # Header compartilhado
 │   └─ ComponentsDeAgendamento/
 │       ├─ TrocaSemana.jsx
 │       ├─ SeletorDia.jsx
 │       ├─ GradeHorarios.jsx
 │       ├─ ModalDeAgendamento.jsx
 │       ├─ SeletorComputadores.jsx
 │       ├─ SeletorImpressoras.jsx
 │       └─ FuncoesCompartilhada.js
 ├─ pages/
 │   ├─ PageIniciais/
 │   │   └─ footer.jsx
 │   ├─ Salas/
 │   │   └─ SalasAlunos.jsx
 │   └─ Agendamento/
 │       ├─ AgendamentoPS5.jsx
 │       ├─ AgendamentoQuadra.jsx
 │       ├─ AgendamentoComputadores.jsx
 │       ├─ AgendamentoImpressoras.jsx
 │       └─ AgendamentoAuditorio.jsx
 ├─ service/
 │   ├─ api.js                  # Configuração base do Axios
 │   ├─ usuario.js              # /usuario/meu-perfil, /usuario/minhas-turmas
 │   ├─ turma.js                # ingressarTurmaPorCodigo
 │   └─ reserva.js              # salvarReservaFormatoBack
 └─ main.jsx / App.jsx          # Entrada da aplicação e rotas

---

## 🔧 Pré-requisitos

- Node.js **>= 18**
- NPM ou Yarn
- Backend do EspaçoSenai rodando (Java / Spring Boot) com CORS liberado para o domínio do front

---

## 🚀 Como instalar e rodar o projeto

1. Clonar o repositório:

   git clone https://github.com/SEU-USUARIO/SEU-REPO.git

2. Entrar na pasta do projeto:

   cd SEU-REPO

3. Instalar dependências:

   npm install
   # ou
   yarn

4. Rodar em ambiente de desenvolvimento:

   npm run dev
   # ou
   yarn dev

O Vite vai exibir no terminal o endereço local, geralmente:  
`http://localhost:5173/`

Se estiver usando outro bundler (Create React App, etc.), basta ajustar o comando de start (`npm start`, etc).

---

## 🌐 Configuração de API

O frontend se comunica com o backend via Axios.  
Normalmente, a URL base é configurada em `src/service/api.js`.

Exemplo de configuração (ajuste para sua realidade):

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // URL do back Spring Boot
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Se o backend estiver em outro domínio/porta (Azure, Render, etc.), atualize o `baseURL` e garanta:

- CORS liberado no backend;
- HTTPS configurado se for ambiente de produção.

---

## 🔐 Autenticação

- O token JWT é salvo no `localStorage` com a chave `access_token`.
- Algumas telas (como os agendamentos) dependem desse token para:
  - Identificar o usuário logado (ID vem no payload do JWT);
  - Enviar `idUsuario` nas reservas (`salvarReservaFormatoBack`).

Se o token estiver ausente ou inválido, as telas exibem mensagens como:

- “Sessão inválida”
- “Não foi possível identificar o usuário logado.”

---

## 🧭 Fluxo principal do usuário (aluno)

1. Faz **login** no sistema.
2. Acessa a **Home do aluno**.
3. Entra em **Salas**:
   - Vê avatar e nome puxados do backend;
   - Visualiza e entra em **turmas** pela seção “Minhas turmas”;
   - Insere o código da turma na seção “Entrar na turma”.
4. Vai para a seção **Agendar**:
   - Escolhe PS5, Quadra, Computadores, Impressoras 3D ou Auditório;
   - Seleciona a data (semana “essa” ou “próxima”);
   - Escolhe horário de início (e término, quando aplicável);
   - Confirma a reserva e aguarda aprovação.

---

## ♿ Acessibilidade & UX

- Botões com `aria-pressed`, `aria-disabled` e foco bem definido;
- Navegação por teclado nos horários (Enter/espaço seleciona);
- Textos claros de erro e sucesso nas modais;
- Cores com bom contraste (vermelho principal `#AE0000`);
- Layout responsivo para mobile, tablet e desktop;
- Dark mode usando classes `dark` do Tailwind.

---
