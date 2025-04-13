import { FC, useState } from 'react'
import clsx from 'clsx'

type SwitchProps = {
  id: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}

const Switch: FC<SwitchProps> = ({ id, checked = false, onChange, label }) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = (): void => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    if (onChange) {
      onChange(newChecked)
    }
  }

  return (
    <div className="flex justify-between items-center">
      {label && (
        <label htmlFor={id} className="mr-2 font-medium cursor-pointer">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        className={clsx(
          'inline-flex relative items-center border-2 border-black rounded-full w-11 h-6 transition-colors',
          isChecked ? 'bg-primary' : 'bg-gray-300'
        )}
      >
        <span
          className={clsx(
            'inline-block border-2 border-black rounded-full w-6 h-6 transition-transform transform',
            isChecked ? 'translate-x-5 bg-black' : 'translate-x-[-2px] bg-white '
          )}
        />
      </button>
    </div>
  )
}

export default Switch
