import Button from '@renderer/components/Button'
import { FC } from 'react'

type PeakAViewDialogProps = {
  isPartyOver: boolean
  count: number
  cancelLabel: string
  onCancel: () => void
  continueLabel: string
  onContinue: () => void
  scoreTitle: string
  scoreContent: string
}

const PeakAViewDialog: FC<PeakAViewDialogProps> = ({
  isPartyOver,
  count,
  cancelLabel,
  continueLabel,
  onCancel,
  onContinue,
  scoreTitle,
  scoreContent
}): JSX.Element | undefined => {
  return isPartyOver ? (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30">
      <div className="bg-white shadow-xl p-6 rounded-2xl w-[60%] max-w-sm text-center">
        <h2 className="mb-2 font-bold text-xl">{scoreTitle}</h2>
        <p className="mb-4 text-gray-700 text-sm">{scoreContent}</p>

        <p className="pb-4 font-accent font-bold text-2xl"> {count} </p>

        <div className="flex flex-col items-center gap-2 w-full">
          <Button
            mode="inline"
            label={cancelLabel}
            onClick={onCancel}
            type="button"
            style={{
              color: 'oklch(70.7% 0.022 261.325)'
            }}
          />
          <Button label={continueLabel} onClick={onContinue} type="button" color="bg-primary" />
        </div>
      </div>
    </div>
  ) : undefined
}

export default PeakAViewDialog
