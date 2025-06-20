# Controle Financeiro Vue

Sistema de controle financeiro desenvolvido com Vue 3, integrado com uma API backend.

## Tecnologias Utilizadas

- Vue 3 (Composition API)
- Vue Router
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
- Gerenciamento de categorias
- Relatórios financeiros
- Autenticação de usuários

## Instalação e Execução

1. Clone o repositório:

```
git clone https://github.com/seu-usuario/controle-financeiro-vue.git
cd controle-financeiro-vue
```

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

Este projeto consome uma API REST localizada em `C:\Users\wesle\Documents\Projetos\ControleFinanceiroAPI`. Certifique-se de que a API esteja em execução antes de iniciar o frontend.

## Estrutura de Diretórios

```
controle-financeiro-vue/
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
