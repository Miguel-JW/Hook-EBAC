import { useState, useEffect } from 'react'

/**
 * Hook customizado que sincroniza um estado React com o localStorage.
 * Encapsula toda a lógica de leitura/escrita e tratamento de erros,
 * podendo ser reaproveitado por qualquer outro estado que precise persistir.
 *
 * @param {string} key - chave usada no localStorage
 * @param {*} initialValue - valor inicial caso não exista nada salvo
 * @returns {[*, Function]} valor atual e função para atualizá-lo (igual ao useState)
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.warn(`Não foi possível ler "${key}" do localStorage:`, error)
      return initialValue
    }
  })

  // useEffect garante que toda alteração no valor seja persistida
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Não foi possível salvar "${key}" no localStorage:`, error)
    }
  }, [key, value])

  return [value, setValue]
}
