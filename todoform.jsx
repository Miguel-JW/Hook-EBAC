import { useCallback, useState } from 'react'
import { useTodos } from '../hooks/useTodos.js'

export default function TodoForm() {
  const { addTodo } = useTodos()
  const [text, setText] = useState('')

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      addTodo(text)
      setText('')
    },
    [addTodo, text]
  )

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="O que você precisa fazer?"
        aria-label="Nova tarefa"
      />
      <button type="submit">Adicionar</button>
    </form>
  )
}
