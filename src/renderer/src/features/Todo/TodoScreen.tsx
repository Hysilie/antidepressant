import Button from '@renderer/components/Button'
import Container from '@renderer/components/Container'
import Empty from '@renderer/components/Empty'
import Header from '@renderer/components/Header'
import LockedScreen from '@renderer/LockedScreen'
import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import { useTodo } from '@renderer/providers/Todo/useTodo'
import { useNetworkStatus } from '@renderer/providers/utils/useNetworkStatus'
import { routes } from '@renderer/utils/Routes/routes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'remeda'
import clsx from 'clsx'
import ProgressCircle from '@renderer/components/ProgressCircle'
import DropDownMenu from '@renderer/components/DropdownMenu'
import { useEffect, useState } from 'react'

import FeatherIcon from 'feather-icons-react'
import Loader from '@renderer/components/Loader'
import { sortTodos } from './sortTodo'

export type SortOption = 'date' | 'completed' | 'completedInverse' | 'dateInverse'
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Most completed', value: 'completed' },
  { label: 'Least completed', value: 'completedInverse' },
  { label: 'Newest first', value: 'date' },
  { label: 'Oldest first', value: 'dateInverse' }
]

const TodoScreen = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'todo' })
  const navigate = useNavigate()
  const isOnline = useNetworkStatus()
  const { isScreenLocked } = useLock()

  const navigateToEditTodo = (id?: string): void | Promise<void> => navigate(routes.todoEdit(id))
  const { todoList, loading } = useTodo()
  const [moreOptions, setMoreOptions] = useState(false)

  const initialSortOption = (localStorage.getItem('sortOption') as SortOption) || 'date'
  const [sortOption, setSortOption] = useState<SortOption>(initialSortOption)

  useEffect(() => {
    localStorage.setItem('sortOption', sortOption)
  }, [sortOption])

  return loading ? (
    <Loader />
  ) : isScreenLocked ? (
    <LockedScreen target={routes.todo} />
  ) : (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-x-hidden">
      <Header
        title={t('title')}
        icon={true}
        target={routes.home}
        extraButton={
          <button onClick={() => setMoreOptions(true)}>
            <FeatherIcon icon="filter" size={18} />
          </button>
        }
      />
      <DropDownMenu onClose={() => setMoreOptions(false)} visible={moreOptions}>
        {SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            onClick={() => {
              setSortOption(option.value)
              setMoreOptions(false)
            }}
            label={option.label}
            mode="inline"
            type="button"
            color={sortOption === option.value ? 'bg-primary' : 'bg-transparent'}
            style={{
              fontSize: 'small',
              fontWeight: sortOption === option.value ? 'bold' : 'normal'
            }}
          />
        ))}
      </DropDownMenu>

      <div className="flex flex-col flex-grow rounded-lg w-full overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto">
          {isEmpty(todoList) && (
            <div className="flex justify-center items-center w-full h-full overflow-x-hidden">
              <Empty title={t('empty.title')} content={t('empty.content')} />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full overflow-x-hidden">
            {sortTodos(todoList, sortOption)?.map((list, index) => {
              const doc = new DOMParser().parseFromString(list.todos, 'text/html')
              const items = [...doc.querySelectorAll('[data-type="taskItem"]')]
              const count = items?.filter(
                (item) => item?.getAttribute('data-checked') === 'true'
              )?.length
              const total = items?.length

              return (
                <button
                  className={clsx(
                    'flex items-center gap-4 hover:bg-gray-100 p-2 hover:rounded-md w-full max-w-full overflow-hidden text-left truncate',
                    {
                      'border-b':
                        sortTodos(todoList, sortOption)?.indexOf(list) !== todoList?.length - 1
                    }
                  )}
                  disabled={!isOnline}
                  key={index}
                  onClick={() => navigateToEditTodo(list.id)}
                >
                  <ProgressCircle percent={(count / total) * 100} isEmpty={total === 0} />
                  <div>
                    <p>{list.title}</p>
                    <p className="text-gray-400 text-xs">
                      {total === 0 ? t('notask') : t('progress', { count: count, total })}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-2">
          <Button
            onClick={() => navigateToEditTodo()}
            label={t('new')}
            type="button"
            color={'bg-primary'}
          />
        </div>
      </div>
    </Container>
  )
}

export default TodoScreen
