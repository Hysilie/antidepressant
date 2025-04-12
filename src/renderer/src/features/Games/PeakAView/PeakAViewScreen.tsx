import Container from '@renderer/components/Container'
import Header from '@renderer/components/Header'
import { routes } from '@renderer/utils/Routes/routes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import Button from '@renderer/components/Button'
import bg1 from '../../../assets/backgrounds/bg-468FB7.png'
import bg2 from '../../../assets/backgrounds/bg-46B7A7.png'
import bg3 from '../../../assets/backgrounds/bg-87DFE2.png'
import bg4 from '../../../assets/backgrounds/bg-C995CD.png'
import bg5 from '../../../assets/backgrounds/bg-F2ABE7.png'
import bg6 from '../../../assets/backgrounds/bg-F68052.png'
import bg7 from '../../../assets/backgrounds/bg-F8D7A5.png'
import bg8 from '../../../assets/backgrounds/bg-FE8D8D.png'

export type Card = {
  id: number
  value: number
  isMatched: boolean
}

const BG_MAP: Record<number, string> = {
  1: bg1,
  2: bg2,
  3: bg3,
  4: bg4,
  5: bg5,
  6: bg6,
  7: bg7,
  8: bg8
}

const PeakAViewScreen = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'games.peak' })
  const [deck, setDeck] = useState<Card[]>([])
  const [revealedCards, setRevealedCards] = useState<Card[]>([])
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const isPartyOver = deck?.every((card) => card.isMatched)
  const [lockPick, setLockPick] = useState(false)

  const generateDeck = useCallback((): Card[] => {
    return Array.from({ length: 16 }, (_, index) => ({
      id: index,
      value: Math.floor(index / 2) + 1,
      isMatched: false
    })).sort(() => Math.random() - 0.5)
  }, [])

  const [peakAViewDeck, setPeakAViewDeck] = useState<Card[]>(generateDeck())

  const reloadDeck = useCallback((): void => {
    setPeakAViewDeck(generateDeck())
    setDeck([])
    setRevealedCards([])
    setCount(0)
  }, [generateDeck])

  const reveal = useCallback(
    (card: Card): void => {
      if (revealedCards.length >= 2) return
      setRevealedCards([...revealedCards, card])
    },
    [revealedCards]
  )

  const isAMatch = useCallback((): void => {
    if (revealedCards.length !== 2) return
    setLockPick(true)

    const [first, second] = revealedCards

    if (first.value === second.value) {
      const matchedIds = new Set(revealedCards.map((card) => card.id))
      setDeck((prevDeck) =>
        prevDeck.map((card) => (matchedIds.has(card.id) ? { ...card, isMatched: true } : card))
      )
    }

    setTimeout(() => {
      setRevealedCards([])
      setLockPick(false)
    }, 600)
  }, [revealedCards])

  useEffect(() => {
    if (revealedCards.length === 2) {
      setCount((count) => count + 1)
      isAMatch()
    }
  }, [revealedCards, isAMatch])

  useEffect(() => {
    setDeck(peakAViewDeck)
    setRevealedCards([])
    setCount(0)
    setIsPlaying(true)
  }, [peakAViewDeck])

  return (
    <Container spacing="large" primary className="flex flex-col w-full h-full overflow-x-hidden">
      <Header title={t('title')} icon={true} target={routes.games} />
      {isPlaying ? (
        <div className="flex flex-col flex-grow rounded-lg w-full overflow-hidden">
          {isPartyOver ? (
            <div className="bottom-[50%] left-[32%] absolute flex justify-center items-center bg-white border-2 border-black rounded-2xl w-32 h-20 text-sm">
              Score : {count}
              <Button mode="inline" label="Again ?" onClick={reloadDeck} />
            </div>
          ) : undefined}
          <div className="flex flex-grow pt-4 overflow-y-auto">
            <div className="flex justify-center items-center w-full h-full">
              <div className="gap-3 grid grid-cols-4 grid-rows-3">
                {deck?.map((card) => {
                  const isDisabled =
                    revealedCards.length >= 2 ||
                    card.isMatched ||
                    revealedCards.some((c) => c === card)
                  const isRevealedOrMatched =
                    revealedCards.some((c) => c === card) || card.isMatched
                  return (
                    <div
                      onClick={isDisabled || lockPick ? undefined : (): void => reveal(card)}
                      key={card.id}
                      className={clsx(
                        'w-16 h-20 card',
                        isDisabled || lockPick
                          ? 'cursor-auto'
                          : 'cursor-pointer hover:scale-110 transition-transform duration-300',
                        isRevealedOrMatched ? 'card_flip' : undefined
                      )}
                    >
                      <div
                        className={clsx(
                          'relative w-full h-full transition-transform duration-500 card__content',
                          isRevealedOrMatched ? 'rotate-y-180' : ''
                        )}
                      >
                        <div className="top-0 right-0 bottom-0 left-0 absolute flex justify-center items-center bg-white border-2 border-black rounded-2xl card__front"></div>
                        <div
                          className="top-0 right-0 bottom-0 left-0 absolute bg-cover bg-center border-2 border-black rounded-2xl card__back"
                          style={{
                            backgroundImage: `url(${BG_MAP[card?.value]})`,
                            backgroundSize: '130px 130px',
                            backgroundPosition: 'top'
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button label="Play" onClick={() => setIsPlaying(true)} />
      )}
    </Container>
  )
}

export default PeakAViewScreen
