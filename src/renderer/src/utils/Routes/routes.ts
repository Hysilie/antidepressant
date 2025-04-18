export const routes = {
  home: '/',
  journal: '/journal',
  journalEdit: (id?: string): string => `/journal/edit${id ? `/${id}` : ''}`,
  games: '/games',
  login: '/login',
  peak: '/games/peak',
  player: '/player',
  preferences: '/preferences',
  signup: '/signup',
  todo: '/todo',
  todoEdit: (id?: string): string => `/todo/edit${id ? `/${id}` : ''}`
} as const
