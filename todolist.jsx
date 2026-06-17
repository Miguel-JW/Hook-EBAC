import { memo } from 'react'
import { useTodos } from '../hooks/useTodos.js'
import TodoItem from './TodoItem.jsx'

function TodoList() {
  const { filteredTodos } = useTodos()

  if (filteredTodos.length === 0) {
    return <p className="empty-state">Nenhuma tarefa por aqui.</p>
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

export default memo(TodoList)
