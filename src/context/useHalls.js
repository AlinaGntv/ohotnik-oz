import { useContext } from 'react'
import { HallContext } from './HallContext.js'

export function useHalls() {
  const value = useContext(HallContext)
  if (!value) throw new Error('useHalls должен вызываться внутри HallProvider')
  return value
}
