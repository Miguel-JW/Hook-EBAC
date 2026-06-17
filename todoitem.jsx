import { memo } from 'react'
import { useTodos } from '../hooks/useTodos.js'

function TodoItem({ todo }) {
  const { toggleTodo, removeTodo } = useTodos()

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label>
        <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <button
        type="button"
        className="remove-btn"
        onClick={() => removeTodo(todo.id)}
        aria-label={`Remover tarefa "${todo.text}"`}
      >
        ✕
      </button>
    </li>
  )
}

// React.memo: cada item só re-renderiza se as suas próprias props (todo) mudarem,
// não quando outro item da lista é marcado/removido
export default memo(TodoItem)
