export const routes = {
  home: '/',
  journal: '/journal',
  journalEdit: (id?: string): string => `/journal/edit${id ? `/${id}` : ''}`,
  login: '/login',
  player: '/player',
  settings: '/settings',
  signup: '/signup',
  todo: '/todo',
  todoEdit: (id?: string): string => (id ? `/todo/edit/${id}` : '/todo/edit')
} as const
