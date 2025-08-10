# 🖥️ Sistema de Reserva de Salas - Frontend

Este é o **frontend** do sistema de reservas de salas de reunião, desenvolvido como parte de um teste técnico para a empresa **Banana Ltda**.  
O projeto foi construído com **Vite**, **React** e **TypeScript**, com foco em **desempenho**, **componentização** e **validação robusta de dados**.

---

## 🚀 Tecnologias Utilizadas e Justificativa

- **[React](https://react.dev/)**  
  Biblioteca JavaScript para criação de interfaces reativas e componentizadas. Escolha ideal para aplicações modernas pela performance e grande ecossistema.

- **[TailwindCSS](https://tailwindcss.com/docs/installation/using-vite)**  
  Utilizado para acelerar o desenvolvimento da interface, aproveitando seu sistema de classes utilitárias que permite criar layouts responsivos e personalizados de forma rápida, sem a necessidade de escrever CSS complexo.

- **[TypeScript](https://www.typescriptlang.org/)**  
  Superset do JavaScript com tipagem estática, que evita erros comuns em tempo de execução e melhora a clareza do código.

- **[Vite](https://vitejs.dev/)**  
  Ferramenta de build extremamente rápida, com servidor de desenvolvimento que oferece recarregamento instantâneo (HMR).

- **[React Query](https://tanstack.com/query/v3/)**  
  Biblioteca para gerenciamento de dados assíncronos, que simplifica fetch, cache, sincronização e atualização automática dos dados da API, melhorando a performance e experiência do usuário.

- **[React Data Grid](https://adazzle.github.io/react-data-grid/)**  
  Componente de tabela de alta performance, usado para exibir a listagem de reservas com funcionalidades de ordenação, paginação e personalização de células.

- **[Axios](https://axios-http.com/)**  
  Cliente HTTP baseado em Promises, utilizado para se comunicar com a API backend.

- **[React Router](https://reactrouter.com/)**  
  Biblioteca para gerenciamento de rotas no frontend, permitindo navegação entre páginas sem recarregar a aplicação.

- **[Zod](https://zod.dev/)**  
  Biblioteca para validação de esquemas e tipagem. Usada para definir e validar os modelos de dados do frontend, garantindo integridade antes de enviar ou processar informações.

---

## 📋 Requisitos

- **Node.js** versão **22.12.0**  
  Baixar em: [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)  
  Essa versão garante compatibilidade com todas as dependências do projeto.

- **npm** (instalado junto com o Node.js) ou **yarn**

> 💡 Para verificar se o Node e o npm estão instalados, abra o terminal e digite:
```bash
node -v
npm -v
```

---

## 📦 Como Baixar o Projeto

1. **Abrir o terminal**  
   - No **Windows**: pressione `Win + R`, digite `cmd` e pressione Enter.  
   - No **Mac/Linux**: abra o aplicativo **Terminal**.

2. **Clonar o repositório** (necessário ter o Git instalado)  
```bash
git clone https://github.com/seu-usuario/banana-frontend.git
cd banana-frontend
```

---

## ⚙️ Como Rodar o Projeto

1. **Instalar as dependências**  
   No terminal, dentro da pasta do projeto, execute:
```bash
npm install
# ou
yarn install
```

2. **Configurar variáveis de ambiente**  
Se necessário, crie um arquivo `.env` na raiz do projeto e adicione:
```env
VITE_API_URL=http://localhost:5009/api/
```
> Troque o valor para a URL onde seu backend está rodando.

3. **Iniciar o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acessar no navegador**  
Abra: [http://localhost:3000](http://localhost:3000)

---

## 📂 Estrutura do Projeto

```
src/
 ├── app/          # Configuração global da aplicação
 ├── assets/       # Arquivos estáticos (imagens, ícones, etc.)
 ├── components/   # Componentes reutilizáveis
 ├── config/       # Configurações gerais (URLs, chaves, etc.)
 ├── features/     # Funcionalidades específicas (ex: reservas)
 ├── hooks/        # Custom hooks React
 ├── lib/          # Integrações com libs externas
 ├── models/       # Modelos de dados validados com Zod
 ├── stores/       # (Não utilizado neste projeto)
 ├── utils/        # Funções utilitárias
 ├── index.css     # Estilos globais
 └── main.tsx      # Ponto de entrada principal
```

---

## 📌 Funcionalidades

- Listagem de reservas usando **React Data Grid**
- Cadastro, edição e exclusão de reservas
- Validações de dados com **Zod**
- Comunicação com API usando **Axios**
- Navegação entre páginas com **React Router**

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de **avaliação técnica**.
