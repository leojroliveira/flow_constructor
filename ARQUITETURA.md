# Estrutura do simulador de processos

O projeto continua estático: não exige instalação, servidor ou conexão com a
internet. Para executá-lo, basta manter as pastas no mesmo lugar e abrir
`main.html` no navegador.

## Organização

```text
main.html
css/
  base.css
  flow.css
  status-bar.css
js/
  core/
    flow-ui.js
  processes/
    substituicao/
      config.js
      state.js
      rules.js
      render.js
      status.js
      actions.js
      app.js
```

### Núcleo reutilizável

- `css/base.css`: tema, tipografia e botões básicos.
- `css/flow.css`: caixas, conectores, bifurcações e estados visuais.
- `css/status-bar.css`: faixa inferior de status.
- `js/core/flow-ui.js`: funções genéricas para criar caixas, conectores,
  botões de decisão e indicadores de status.

Esses arquivos podem ser reaproveitados por outros processos.

### Processo de substituição

- `config.js`: limites e valores configuráveis.
- `state.js`: formato e estado inicial do processo.
- `rules.js`: regras de autorização e estados das ramificações.
- `render.js`: representação visual específica da substituição.
- `status.js`: cálculo das fases e dos status gerais.
- `actions.js`: ações dos atores e transições do estado.
- `app.js`: inicialização e reinicialização.

## Criação de outro processo

Crie uma nova pasta dentro de `js/processes`, sem alterar o núcleo. O novo
processo deve possuir seu próprio estado, regras, renderização, status, ações e
inicialização. Depois, carregue esses arquivos em uma nova página HTML na ordem
correta, sempre depois de `js/core/flow-ui.js` quando depender dos componentes
visuais genéricos.

As regras de negócio devem permanecer em `rules.js` ou nas funções de transição
de `actions.js`. A renderização deve consultar essas regras, evitando duplicar a
mesma condição em diferentes pontos do código.
