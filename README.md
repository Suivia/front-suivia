# SUIVIA Frontend

Frontend da plataforma SUIVIA - Sistema de Gestão e Acompanhamento

## Tecnologias

- **React** 18.2+ - Biblioteca de UI
- **Vite** 4.4+ - Build tool moderno e rápido
- **CSS 3** - Estilos
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## Instalação

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Setup

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview

# Verificar qualidade do código
npm run lint

# Formatar código
npm run format
```

## Estrutura do Projeto

```
/
├── src/                  # Código-fonte da aplicação
│   ├── App.jsx          # Componente raiz
│   ├── App.css          # Estilos do App
│   ├── main.jsx         # Ponto de entrada React
│   └── index.css        # Estilos globais
├── frontend/            # Pasta legada
├── index.html           # HTML principal
├── vite.config.js       # Configuração do Vite
├── package.json         # Dependências do projeto
├── .eslintrc.json       # Configuração ESLint
├── .prettierrc.json     # Configuração Prettier
└── .gitignore           # Arquivos ignorados pelo Git
```

## Desenvolvimento

O servidor de desenvolvimento inicia em `http://localhost:3000` com Hot Module Replacement (HMR) habilitado.

## Build

Para criar uma build otimizada para produção:

```bash
npm run build
```

Os arquivos compilados estarão em `/dist`

## Autor

SUIVIA Team

## Licença

MIT