export const routes = {
  home: '/',
  journal: '/journal',
  journalEdit: (id?: string): string => (id ? `/journal/edit/${id}` : '/journal/edit'),
  player: '/player',
  settings: '/settings',
  todo: '/todo',
  todoEdit: (id?: string): string => (id ? `/todo/edit/${id}` : '/todo/edit')
} as const
