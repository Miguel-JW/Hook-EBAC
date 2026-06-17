import TodoForm from './components/TodoForm.jsx'
import TodoFilters from './components/TodoFilters.jsx'
import TodoList from './components/TodoList.jsx'
import TodoStats from './components/TodoStats.jsx'

export default function App() {
  return (
    <div className="app">
      <div className="card">
        <header className="card-header">
          <h1>Lista de Tarefas</h1>
          <TodoStats />
        </header>
        <TodoForm />
        <TodoFilters />
        <TodoList />
      </div>
    </div>
  )
}
