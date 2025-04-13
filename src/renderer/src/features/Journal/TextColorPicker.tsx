import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { colorOptions } from '@renderer/providers/Preferences/Theme/colors'

interface Props {
  editor: Editor
}

const TextColorPicker = ({ editor }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)

  const currentColor = editor.getAttributes('textStyle').color
  const selected = colorOptions.find((c) => c.hex === currentColor)
  const ref = useRef<HTMLUListElement>(null)
  const applyColor = (hex: string): void => {
    editor.chain().focus().setColor(hex).run()
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: { target: unknown }): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setOpen])

  return (
    <div className="">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full"
      >
        <span
          className="border border-black rounded-full w-4 h-4"
          style={{ backgroundColor: selected?.hex ?? '#000' }}
        />
      </button>

      {open && (
        <ul
          ref={ref}
          className="right-7 bottom-14 z-10 absolute bg-white shadow-lg mt-2 py-1 border-2 border-black rounded-2xl max-h-60 overflow-auto"
        >
          {colorOptions.map(({ hex }) => (
            <li
              key={hex}
              onClick={() => applyColor(hex)}
              className={`cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-gray-100 ${
                hex === currentColor ? 'font-bold' : 'font-normal'
              }`}
            >
              <span
                className="border border-black rounded-full w-4 h-4"
                style={{ backgroundColor: hex }}
              />
            </li>
          ))}
          <li
            key={'black'}
            onClick={() => applyColor('black')}
            className={`cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-gray-100 ${
              'black' === currentColor ? 'font-bold' : 'font-normal'
            }`}
          >
            <span
              className="border border-black rounded-full w-4 h-4"
              style={{ backgroundColor: 'black' }}
            />
          </li>
        </ul>
      )}
    </div>
  )
}

export default TextColorPicker
