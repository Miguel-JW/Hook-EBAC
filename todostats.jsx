import { memo } from 'react'
import { useTodos } from '../hooks/useTodos.js'

function TodoStats() {
  const { stats } = useTodos()
  return (
    <div className="todo-stats">
      <span className="mono">
        {stats.completed}/{stats.total}
      </span>{' '}
      tarefas concluídas
    </div>
  )
}

export default memo(TodoStats)
