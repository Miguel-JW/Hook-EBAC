import { createContext, useCallback, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export const TodoContext = createContext(null)

let nextId = 1

/**
 * Provider que centraliza todo o estado global da lista de tarefas.
 * Qualquer componente da árvore pode acessar e atualizar esse estado
 * através do hook useTodos (useContext por baixo dos panos).
 */
export function TodoProvider({ children }) {
  // useState (via useLocalStorage) gerencia a lista e já persiste automaticamente
  const [todos, setTodos] = useLocalStorage('todos:v1', [])
  const [filter, setFilter] = useState('all') // 'all' | 'completed' | 'pending'

  const addTodo = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (!trimmed) return
      setTodos((prev) => [
        ...prev,
        { id: `${Date.now()}-${nextId++}`, text: trimmed, completed: false },
      ])
    },
    [setTodos]
  )

  const toggleTodo = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
      )
    },
    [setTodos]
  )

  const removeTodo = useCallback(
    (id) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    },
    [setTodos]
  )

  // useMemo evita recalcular a lista filtrada a cada render,
  // só refaz o cálculo quando "todos" ou "filter" realmente mudam
  const filteredTodos = useMemo(() => {
    if (filter === 'completed') return todos.filter((t) => t.completed)
    if (filter === 'pending') return todos.filter((t) => !t.completed)
    return todos
  }, [todos, filter])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    return { total, completed, pending: total - completed }
  }, [todos])

  // O próprio valor do contexto também é memoizado, para que componentes
  // que usam useTodos não recebam uma nova referência a cada render do Provider
  const value = useMemo(
    () => ({ todos, filteredTodos, filter, setFilter, addTodo, toggleTodo, removeTodo, stats }),
    [todos, filteredTodos, filter, addTodo, toggleTodo, removeTodo, stats]
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
