import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, memo } from "react";
import { Plus, X, ListChecks } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Hook customizado: persiste o estado usando o storage do artifact   */
/* (equivalente ao useLocalStorage + useEffect do projeto completo)   */
/* ------------------------------------------------------------------ */
function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await window.storage.get(key, false);
        if (mounted && result) setValue(JSON.parse(result.value));
      } catch (e) {
        // chave ainda não existe — usa o valor inicial
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, [key]);

  useEffect(() => {
    if (!loaded) return; // evita sobrescrever antes de carregar
    window.storage.set(key, JSON.stringify(value), false).catch(() => {});
  }, [key, value, loaded]);

  return [value, setValue];
}

/* ------------------------------------------------------------------ */
/* Context API: estado global da lista de tarefas                     */
/* ------------------------------------------------------------------ */
const TodoContext = createContext(null);

let nextId = 1;

function TodoProvider({ children }) {
  const [todos, setTodos] = usePersistentState("todos", [
    { id: "seed-1", text: "Estudar Context API", completed: true },
    { id: "seed-2", text: "Criar hook customizado", completed: false },
    { id: "seed-3", text: "Aplicar useMemo na lista", completed: false },
  ]);
  const [filter, setFilter] = useState("all");

  const addTodo = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: `t-${Date.now()}-${nextId++}`, text: trimmed, completed: false }]);
  }, [setTodos]);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [setTodos]);

  const removeTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [setTodos]);

  // useMemo: só recalcula quando "todos" ou "filter" mudam
  const filteredTodos = useMemo(() => {
    if (filter === "completed") return todos.filter((t) => t.completed);
    if (filter === "pending") return todos.filter((t) => !t.completed);
    return todos;
  }, [todos, filter]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return { total, completed, pending: total - completed };
  }, [todos]);

  const value = useMemo(
    () => ({ filteredTodos, filter, setFilter, addTodo, toggleTodo, removeTodo, stats }),
    [filteredTodos, filter, addTodo, toggleTodo, removeTodo, stats]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Hook customizado: encapsula o useContext
function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos deve ser usado dentro de um TodoProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Componentes                                                        */
/* ------------------------------------------------------------------ */

function TodoForm() {
  const { addTodo } = useTodos();
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="O que você precisa fazer?"
        aria-label="Nova tarefa"
        style={{
          flex: 1,
          padding: "11px 14px",
          borderRadius: 10,
          border: "1px solid #e2e6ee",
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "11px 16px",
          borderRadius: 10,
          border: "none",
          background: "#3454d1",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        <Plus size={16} /> Adicionar
      </button>
    </form>
  );
}

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "completed", label: "Concluídas" },
];

const TodoFilters = memo(function TodoFilters() {
  const { filter, setFilter, stats } = useTodos();
  return (
    <div style={{ display: "flex", gap: 4, background: "#eef1f6", padding: 4, borderRadius: 12, marginBottom: 18 }}>
      {FILTERS.map(({ key, label }) => {
        const active = filter === key;
        const count = key === "pending" ? stats.pending : key === "completed" ? stats.completed : null;
        return (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              flex: 1,
              border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "#3454d1" : "#8893a1",
              fontWeight: 600,
              fontSize: 12.5,
              padding: "8px 4px",
              borderRadius: 9,
              cursor: "pointer",
              boxShadow: active ? "0 4px 10px -6px rgba(30,42,56,0.4)" : "none",
            }}
          >
            {label}{count !== null ? ` (${count})` : ""}
          </button>
        );
      })}
    </div>
  );
});

const TodoItem = memo(function TodoItem({ todo }) {
  const { toggleTodo, removeTodo } = useTodos();
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 2px",
        borderBottom: "1px solid #e2e6ee",
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flex: 1 }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          style={{ width: 17, height: 17, accentColor: "#2f9e64", cursor: "pointer" }}
        />
        <span
          style={{
            fontSize: 14.5,
            color: todo.completed ? "#8893a1" : "#1e2a38",
            textDecoration: todo.completed ? "line-through" : "none",
            transition: "color 0.2s",
          }}
        >
          {todo.text}
        </span>
      </label>
      <button
        onClick={() => removeTodo(todo.id)}
        aria-label={`Remover tarefa ${todo.text}`}
        style={{
          border: "none",
          background: "transparent",
          color: "#8893a1",
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
          display: "flex",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#d64550"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#8893a1"; }}
      >
        <X size={15} />
      </button>
    </li>
  );
});

const TodoList = memo(function TodoList() {
  const { filteredTodos } = useTodos();
  if (filteredTodos.length === 0) {
    return <p style={{ textAlign: "center", color: "#8893a1", fontSize: 14, padding: "24px 0" }}>Nenhuma tarefa por aqui.</p>;
  }
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});

const TodoStats = memo(function TodoStats() {
  const { stats } = useTodos();
  return (
    <div style={{ fontSize: 13, color: "#8893a1" }}>
      <span style={{ fontFamily: "monospace", color: "#3454d1", fontWeight: 700 }}>
        {stats.completed}/{stats.total}
      </span>{" "}
      concluídas
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <TodoProvider>
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px", fontFamily: "Inter, sans-serif", minHeight: 480 }}>
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 20px 45px -25px rgba(30,42,56,0.35)",
            padding: 24,
          }}
        >
          <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
            <h1 style={{ fontSize: 21, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8, color: "#1e2a38" }}>
              <ListChecks size={20} color="#3454d1" /> Tarefas
            </h1>
            <TodoStats />
          </header>
          <TodoForm />
          <TodoFilters />
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
}
