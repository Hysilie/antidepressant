import './assets/main.css'
import { BrowserRouter, Routes, Route } from 'react-router'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SettingsScreen from './features/Settings/SettingsScreen'
import TodoScreen from './features/Todo/TodoScreen'
import PlayerScreen from './features/Player/PlayerScreen'
import JournalScreen from './features/Journal/JournalScreen'
import JournalEditor from './features/Journal/JournalEditor'
import TodoEditor from './features/Todo/TodoEditor'
import { routes } from './utils/routes'
import { JournalProvider } from './providers/Journal/JournalProvider'
import { TodoProvider } from './providers/Todo/TodoProvider'

const routeConfig = [
  { path: routes.home, element: <App /> },
  { path: routes.settings, element: <SettingsScreen /> },
  { path: routes.todo, element: <TodoScreen /> },
  { path: routes.todoEdit(), element: <TodoEditor /> },
  { path: routes.todoEdit(':id'), element: <TodoEditor /> },
  { path: routes.player, element: <PlayerScreen /> },
  { path: routes.journal, element: <JournalScreen /> },
  { path: routes.journalEdit(), element: <JournalEditor /> },
  { path: routes.journalEdit(':id'), element: <JournalEditor /> }
]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TodoProvider>
      <JournalProvider>
        <BrowserRouter>
          <Routes>
            {routeConfig.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </BrowserRouter>
      </JournalProvider>
    </TodoProvider>
  </React.StrictMode>
)
