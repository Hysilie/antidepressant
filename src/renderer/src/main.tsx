import './assets/main.css'
import { BrowserRouter, Routes, Route } from 'react-router'

import React from 'react'
import ReactDOM from 'react-dom/client'
import SettingsScreen from './features/Settings/SettingsScreen'
import TodoScreen from './features/Todo/TodoScreen'
import PlayerScreen from './features/Player/PlayerScreen'
import JournalScreen from './features/Journal/JournalScreen'
import JournalEditor from './features/Journal/JournalEditor'
import TodoEditor from './features/Todo/TodoEditor'
import { routes } from './utils/Routes/routes'
import { JournalProvider } from './providers/Journal/JournalProvider'
import { TodoProvider } from './providers/Todo/TodoProvider'
import SignUpScreen from './features/Login/SignUpScreen'
import LoginScreen from './features/Login/LoginScreen'
import { AuthProvider } from './providers/Auth/AuthProvider'
import ProtectedRoute from './utils/Routes/ProtectedRoutes'
import HomeScreen from './features/Home/HomeScreen'
import AppLayout from './AppLayout'

const routeConfig = [
  // Protected Routes
  { path: routes.home, element: <HomeScreen /> },
  { path: routes.journal, element: <JournalScreen /> },
  { path: routes.journalEdit(), element: <JournalEditor /> },
  { path: routes.journalEdit(':id'), element: <JournalEditor /> },
  { path: routes.player, element: <PlayerScreen /> },
  { path: routes.settings, element: <SettingsScreen /> },
  { path: routes.todo, element: <TodoScreen /> },
  { path: routes.todoEdit(), element: <TodoEditor /> },
  { path: routes.todoEdit(':id'), element: <TodoEditor /> }
]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TodoProvider>
          <JournalProvider>
            <Routes>
              <Route path={routes.signup} element={<SignUpScreen />} />
              <Route path={routes.login} element={<LoginScreen />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  {routeConfig.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                </Route>
              </Route>
            </Routes>
          </JournalProvider>
        </TodoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
