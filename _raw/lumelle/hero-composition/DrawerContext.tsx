import { createContext, useContext } from 'react'

type DrawerApi = {
  openCart: () => void
  openMenu: () => void
}

export const DrawerContext = createContext<DrawerApi>({
  openCart: () => {},
  openMenu: () => {},
})

export const useDrawer = () => useContext(DrawerContext)
