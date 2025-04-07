import Button from './Button'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm
}: ConfirmDialogProps): JSX.Element | null => {
  return !open ? null : (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30">
      <div className="bg-white shadow-xl p-6 rounded-2xl w-[90%] max-w-sm text-center">
        <h2 className="mb-2 font-bold text-xl">{title}</h2>
        <p className="mb-6 text-gray-700 text-sm">{description}</p>

        <div className="flex flex-col items-center gap-2">
          <Button mode="inline" label={confirmLabel} type="button" onClick={onConfirm} />
          <Button
            label={cancelLabel}
            onClick={() => onOpenChange(false)}
            type="button"
            color="bg-primary"
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
