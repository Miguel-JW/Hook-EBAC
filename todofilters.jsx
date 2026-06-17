import { memo } from 'react'
import { useTodos } from '../hooks/useTodos.js'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'completed', label: 'Concluídas' },
]

function TodoFilters() {
  const { filter, setFilter, stats } = useTodos()

  return (
    <div className="todo-filters" role="tablist" aria-label="Filtrar tarefas">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={filter === key}
          className={filter === key ? 'active' : ''}
          onClick={() => setFilter(key)}
        >
          {label}
          {key === 'pending' && ` (${stats.pending})`}
          {key === 'completed' && ` (${stats.completed})`}
        </button>
      ))}
    </div>
  )
}

// React.memo evita re-render deste componente quando apenas a lista
// de tarefas muda mas o filtro/estatísticas seguem iguais
export default memo(TodoFilters)
