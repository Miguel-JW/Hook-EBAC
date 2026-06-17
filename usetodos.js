import { useContext } from 'react'
import { TodoContext } from '../context/TodoContext.jsx'

/**
 * Hook customizado que encapsula o useContext(TodoContext).
 * Evita repetir a importação do contexto em cada componente
 * e garante um erro claro caso seja usado fora do Provider.
 */
export function useTodos() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos deve ser usado dentro de um <TodoProvider>')
  }
  return context
}
