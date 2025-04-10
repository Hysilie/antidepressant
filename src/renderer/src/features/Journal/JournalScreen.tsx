import Button from '@renderer/components/Button'
import Container from '@renderer/components/Container'
import Empty from '@renderer/components/Empty'
import Header from '@renderer/components/Header'
import LockedScreen from '@renderer/LockedScreen'
import { useJournal } from '@renderer/providers/Journal/useJournal'
import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import { useNetworkStatus } from '@renderer/providers/utils/useNetworkStatus'
import { routes } from '@renderer/utils/Routes/routes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'remeda'
import clsx from 'clsx'
import Loader from '@renderer/components/Loader'

const JournalScreen = (): JSX.Element => {
  const { pages, loading } = useJournal()
  const { isScreenLocked } = useLock()
  const isOnline = useNetworkStatus()

  const navigate = useNavigate()
  const navigateToEditNote = (id?: string): void | Promise<void> => navigate(routes.journalEdit(id))
  const { t } = useTranslation('translation', { keyPrefix: 'journal' })
  const formatDate = (date: string): string =>
    new Date(date).toLocaleString('default', { day: '2-digit', month: 'short' })

  const groupedPages = pages
    .sort((a, b) => {
      const getDate = (entry: typeof a | typeof b): Date =>
        new Date((entry.createdAt as unknown as { seconds: number }).seconds * 1000)

      const dateA = getDate(a)
      const dateB = getDate(b)
      return dateB.getTime() - dateA.getTime()
    })
    .reduce(
      (acc, page) => {
        const date = formatDate(
          new Date((page.createdAt as unknown as { seconds: number }).seconds * 1000).toISOString()
        )
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(page)
        return acc
      },
      {} as Record<string, typeof pages>
    )

  return loading ? (
    <Loader />
  ) : isScreenLocked ? (
    <LockedScreen target={routes.journal} />
  ) : (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-x-hidden">
      <Header title={t('title')} icon={true} target={routes.home} />

      <div className="flex flex-col flex-grow rounded-lg w-full overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto">
          {isEmpty(pages) && (
            <div className="flex justify-center items-center w-full h-full overflow-x-hidden">
              <Empty title={t('empty.title')} content={t('empty.content')} />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full overflow-x-hidden">
            {Object.entries(groupedPages).map(([date, pages]) => (
              <div key={date} className="flex gap-2 mb-4">
                <h2 className="pr-2 border-primary border-r-2 w-16 font-semibold text-lg text-center">
                  {formatDate(date)}
                </h2>

                <div className="flex flex-col gap-2 w-full overflow-x-hidden">
                  {pages?.map((page) => (
                    <button
                      key={page?.id}
                      disabled={!isOnline}
                      onClick={() => navigateToEditNote(page?.id)}
                      className={clsx(
                        'hover:bg-gray-100 p-2 hover:rounded-md w-full max-w-full overflow-hidden text-left truncate',
                        { 'border-b': pages?.indexOf(page) !== pages?.length - 1 }
                      )}
                    >
                      <p className="truncate">{page?.title}</p>
                      <p className="text-gray-400 text-xs truncate">
                        {page?.content.replace(/<img[^>]*>|<\/?[^>]+(>|$)/g, '')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2">
          <Button
            onClick={() => navigateToEditNote()}
            label={t('new')}
            type="button"
            color={'bg-primary'}
          />
        </div>
      </div>
    </Container>
  )
}

export default JournalScreen
