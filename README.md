# Hook-EBAC  
# Lista de Tarefas — React (Hooks, Context API & Memoization)

Aplicação de Todo List construída para aplicar, na prática, os principais recursos avançados do React: Hooks, Hooks customizados, Context API e Memoization.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (normalmente `http://localhost:5173`).

## Funcionalidades

- Adicionar uma nova tarefa
- Marcar/desmarcar uma tarefa como concluída
- Remover tarefas
- Filtrar por: todas, pendentes ou concluídas
- Persistência automática no `localStorage` (recarregar a página não perde os dados)

## Estrutura do projeto

```
src/
├── context/
│   └── TodoContext.jsx     # Estado global da lista (Context API)
├── hooks/
│   ├── useLocalStorage.js  # Hook customizado: persiste qualquer estado no localStorage
│   └── useTodos.js         # Hook customizado: encapsula o useContext(TodoContext)
├── components/
│   ├── TodoForm.jsx        # Input controlado para criar tarefas
│   ├── TodoFilters.jsx     # Abas de filtro (memoizado)
│   ├── TodoList.jsx        # Lista filtrada (memoizado)
│   ├── TodoItem.jsx        # Cada tarefa (memoizado)
│   └── TodoStats.jsx       # Contagem de concluídas/total (memoizado)
├── App.jsx
├── main.jsx
└── index.css
```

## Onde cada recurso do módulo foi aplicado

### Hooks
- `useState` gerencia o texto do novo item (`TodoForm`) e o filtro ativo (`TodoContext`).
- `useEffect`, dentro do hook customizado `useLocalStorage`, sincroniza a lista de tarefas com o `localStorage` a cada mudança.

### Context API
- `TodoContext.jsx` cria o contexto e o `TodoProvider`, que concentra o estado da lista, o filtro ativo e as ações (`addTodo`, `toggleTodo`, `removeTodo`).
- Qualquer componente acessa esse estado global através do `useContext` (encapsulado pelo hook `useTodos`), sem precisar repassar props manualmente (sem "prop drilling").

### Hooks customizados
- `useLocalStorage(key, initialValue)`: hook genérico e reutilizável que sincroniza qualquer estado com o `localStorage`. Poderia ser usado em outro projeto sem alterações.
- `useTodos()`: hook que encapsula `useContext(TodoContext)`, simplifica os imports nos componentes e lança um erro claro se usado fora do `TodoProvider`.

### Memoization
- `useMemo` em `TodoContext.jsx` calcula `filteredTodos` e `stats` apenas quando `todos` ou `filter` mudam — evita refiltrar a lista a cada render.
- O próprio valor do contexto (`value`) é memoizado com `useMemo`, evitando recriação do objeto a cada render do Provider.
- `useCallback` em `addTodo`, `toggleTodo` e `removeTodo` garante que essas funções mantenham a mesma referência entre renders.
- `React.memo` é aplicado em `TodoItem`, `TodoList`, `TodoFilters` e `TodoStats`: cada um só re-renderiza quando suas próprias props/dados relevantes mudam — por exemplo, marcar uma tarefa como concluída não re-renderiza os demais itens da lista.

## Tecnologias

- React 18
- Vite (build tool)
- CSS puro (sem dependências externas de estilo)
