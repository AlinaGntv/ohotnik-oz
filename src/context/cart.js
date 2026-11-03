import { createContext, useContext } from 'react'

// Контекст и хук корзины отдельно от провайдера: файл с компонентом должен
// экспортировать только компоненты, иначе ломается горячая перезагрузка Vite.
export const CartContext = createContext(null)

export const useCart = () => useContext(CartContext)
