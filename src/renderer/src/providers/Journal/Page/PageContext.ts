import { createContext } from 'react'
import { PageContextData } from './type'

export const PageContext = createContext<PageContextData>({} as PageContextData)
