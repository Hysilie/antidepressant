import { useState } from 'react'
import { colorOptions } from '@renderer/providers/Preferences/Theme/colors'
import { useTheme } from '@renderer/providers/Preferences/Theme/useTheme'
import { Theme } from '@renderer/providers/Preferences/types'
import chevron from './icons/chevron-down.svg'

const ColorPicker = (): JSX.Element => {
  const { setColor, color } = useTheme()
  const [open, setOpen] = useState(false)

  const selected = colorOptions.find((c) => c.name === color)

  return (
    <div className="flex justify-between items-center gap-2">
      <label className="font-medium">Theme</label>
      <div className="relative w-52 text-sm">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center bg-white shadow-sm hover:shadow-md px-4 py-2 border-2 border-black rounded-full w-full font-semibold text-left"
        >
          <span className="flex items-center gap-2">
            <span
              className="border border-black rounded-full w-4 h-4"
              style={{ backgroundColor: selected?.hex }}
            />
            {selected?.name}
          </span>
          <img src={chevron} className="w-4 h-4" />
        </button>

        {open && (
          <ul className="z-10 absolute bg-white shadow-lg mt-1 py-1 border-2 border-black rounded-2xl w-full max-h-60 overflow-auto">
            {colorOptions.map(({ name, hex }) => (
              <li
                key={hex}
                onClick={() => {
                  setColor(name as Theme)
                  setOpen(false)
                }}
                className={`cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-gray-100 ${
                  name === color ? 'font-bold' : 'font-normal'
                }`}
              >
                <span
                  className="border border-black rounded-full w-4 h-4"
                  style={{ backgroundColor: hex }}
                />
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ColorPicker
