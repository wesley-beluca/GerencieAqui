# GerencieAqui

Sistema de gerenciamento financeiro desenvolvido com Vue 3, permitindo controle completo de receitas e despesas com interface moderna e intuitiva.

## Tecnologias Utilizadas

- Vue 3 (Composition API)
- Vue Router 4
- Pinia (Gerenciamento de Estado)
- PrimeVue (Componentes UI)
- Axios (Requisições HTTP)
- Chart.js (Gráficos)

## Estrutura do Projeto

O projeto segue uma arquitetura de Design Atômico, organizando os componentes em:

- **Átomos**: Componentes básicos e reutilizáveis (botões, inputs, etc.)
- **Moléculas**: Combinação de átomos para formar componentes mais complexos
- **Organismos**: Combinação de moléculas para formar seções completas da interface
- **Templates**: Estruturas de página que definem o layout

## Funcionalidades

- Dashboard com gráficos e indicadores financeiros
- Cadastro e gerenciamento de transações (receitas e despesas)
- Visualização detalhada de transações com filtros e ordenação
- Sistema completo de autenticação (login, registro, recuperação de senha)
- Interface responsiva e amigável

## Instalação e Execução

1. Clone o repositório:

```
git clone https://github.com/seu-usuario/GerencieAqui.git
cd GerencieAqui
```

2. Instale as dependências:

```
npm install
```

3. Execute o servidor de desenvolvimento:

```
npm run serve
```

4. Acesse a aplicação em `http://localhost:8080`

## Build para Produção

```
npm run build
```

## Estrutura de Diretórios

```
src/
├── assets/         # Recursos estáticos (imagens, estilos)
├── components/     # Componentes reutilizáveis (organização atômica)
├── composables/    # Composables Vue para lógica reutilizável
├── layout/         # Componentes de layout
├── pages/          # Páginas da aplicação
├── plugins/        # Plugins Vue
├── router/         # Configuração de rotas
├── services/       # Serviços para comunicação com API
├── store/          # Stores Pinia para gerenciamento de estado
└── utils/          # Funções utilitárias
```

## Recursos Principais

- **Gestão de Transações**: Interface completa para gerenciar receitas e despesas
- **Dashboard**: Visualização gráfica da situação financeira
- **Sistema de Autenticação**: Login, registro e recuperação de senha
- **Design Responsivo**: Funciona em dispositivos móveis e desktop

## Tecnologias de Desenvolvimento

- **Vue 3**: Framework JavaScript progressivo
- **Composition API**: API moderna para composição de componentes Vue
- **Pinia**: Gerenciamento de estado simples e eficaz
- **PrimeVue**: Biblioteca de componentes UI rica e personalizável
- **Vue Router**: Roteamento oficial para aplicações Vue

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

2. Instale as dependências:

```
npm install
```

3. Execute o projeto em ambiente de desenvolvimento:

```
npm run serve
```

4. Para build de produção:

```
npm run build
```

## API Backend

Este projeto consome uma API REST localizada em https://github.com/wesley-beluca/ControleFinanceiroAPI.git. Certifique-se de que a API esteja em execução antes de iniciar o frontend.

## Estrutura de Diretórios

```
GerencieAqui/
  - src/
    - assets/         # Recursos estáticos (imagens, estilos)
    - components/     # Componentes organizados por Design Atômico
      - atoms/
      - molecules/
      - organisms/
      - templates/
    - composables/    # Lógica reutilizável com Composition API
    - layout/         # Layouts da aplicação
    - pages/          # Páginas da aplicação
    - plugins/        # Plugins Vue
    - router/         # Configuração de rotas
    - store/          # Gerenciamento de estado com Pinia
    - utils/          # Funções utilitárias
```
