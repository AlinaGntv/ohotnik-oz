import { useContext } from 'react'
import { MenuContext } from './menuContext.js'

export function useMenu() {
  const value = useContext(MenuContext)
  if (!value) throw new Error('useMenu должен вызываться внутри MenuProvider')
  return value
}
