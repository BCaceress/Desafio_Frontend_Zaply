# 🚀 Desafio Frontend Zaply

Bem-vindo ao projeto de desafio frontend! Este projeto foi desenvolvido usando [Next.js](https://nextjs.org) com TypeScript e apresenta um catálogo de produtos com funcionalidades avançadas de filtro, pesquisa e visualização detalhada.

## 📋 Sobre o Projeto

Este projeto demonstra uma interface moderna e responsiva para gerenciamento e visualização de produtos. Para simplificar o desenvolvimento e manter o foco nas habilidades de frontend, utilizei uma abordagem interessante:

- Dados de produtos originalmente em CSV foram convertidos para formato JSON
- Utilizei [Mockbin](https://mockbin.io/) para simular uma API RESTful, eliminando a necessidade de um backend dedicado
- Os dados são consumidos através do endpoint: [https://7daf496f49c24182af48ee21542cd665.api.mockbin.io/](https://7daf496f49c24182af48ee21542cd665.api.mockbin.io/)

> **Nota sobre imagens:** Alguns produtos podem apresentar problemas no carregamento de imagens, retornando erro 404 ("Not Found"). Isso é esperado e faz parte do ambiente simulado.

## ✨ Principais Funcionalidades

- **Catálogo Completo**: Listagem de produtos com imagens e informações detalhadas
- **Visualização Flexível**: Opção de visualização por grid ou lista
- **Filtros Avançados**: Filtragem por categorias, marcas e faixa de preço
- **Busca Inteligente**: Sistema de busca por texto
- **Design Responsivo**: Interface adaptável para dispositivos móveis e desktop 
- **Preferências do Usuário**: Seleção de tema claro/escuro
- **Interface Intuitiva**: UX/UI baseada nas práticas observadas no site e vídeo do [Zaply](https://zaply.io/pt/)
  
## 🌐 Demonstração Online

O projeto está disponível para acesso imediato através da [Vercel](https://vercel.com/), com deploy automatizado a partir do repositório GitHub.

**Link da demonstração:**
[https://desafio-frontend-zaply.vercel.app/](https://desafio-frontend-zaply.vercel.app/)

## 🛠️ Tecnologias Utilizadas

- **Next.js 15.3.1** - Framework React
- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Linguagem para desenvolvimento 
- **Tailwind CSS 3.3** - Framework CSS para estilização rápida
- **Framer Motion** - Biblioteca para animações
- **React Icons** - Conjunto ícones
- **MockBin** - Serviço para simulação de API RESTful

## 🚨 Pré-requisitos

- Node.js (versão 18.x ou superior)
- npm ou yarn

## 🚀 Como Iniciar

### Clonando o Repositório

```bash
# Clone este repositório para sua máquina local
git clone https://github.com/BCaceress/Desafio_Frontend_Zaply.git

# Entre na pasta do projeto
cd Desafio_Frontend_Zaply-main
```

### Instalando Dependências

```bash
# Usando npm
npm install

# Ou usando yarn
yarn
```

### Executando o Projeto

```bash
# Inicie o servidor de desenvolvimento com Turbopack
npm run dev

# Ou com yarn
yarn dev
```

Agora abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado!

## 📁 Estrutura do Projeto

O projeto segue uma arquitetura organizada e modular:

- `src/app/` - Páginas e rotas da aplicação (Next.js App Router)
  - `products/` - Página de produtos
- `src/components/` - Componentes React reutilizáveis
  - `layout/` - Componentes de estrutura da página (Navbar, etc)
  - `products/` - Componentes específicos para produtos
  - `ui/` - Elementos de interface genéricos
- `src/hooks/` - Hooks React personalizados
- `src/types/` - Definições de tipos TypeScript
- `src/styles/` - Estilos globais e configurações do Tailwind
- `src/utils/` - Funções reutilizáveis (Máscara valor em reais R$)

---

Desenvolvido com ❤️ como parte do desafio técnico para Zaply.