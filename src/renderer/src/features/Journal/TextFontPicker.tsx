import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import FeatherIcon from 'feather-icons-react'

const FONTS = ['Quicksand', 'Lilita One', 'Patrick Hand']

interface Props {
  editor: Editor
}

const TextFontPicker = ({ editor }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLUListElement>(null)

  const currentFont = editor.getAttributes('textStyle').fontFamily
  const selected = FONTS.find((font) => font === currentFont)

  const applyFont = (font: string): void => {
    editor.chain().focus().setMark('textStyle', { fontFamily: font }).run()
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <button type="button" onClick={() => setOpen(!open)} style={{ fontFamily: selected }}>
        <FeatherIcon icon="type" size={18} color={open ? 'white' : undefined} />
      </button>
      {open && (
        <ul
          ref={ref}
          className="bottom-14 left-6 z-10 absolute bg-white shadow mt-2 p-1 border-2 border-black rounded-2xl text-sm"
        >
          {FONTS.map((font) => (
            <li
              key={font}
              onClick={() => applyFont(font)}
              className={`cursor-pointer px-4 py-1 hover:bg-gray-100 ${
                font === currentFont ? 'font-bold' : 'font-normal'
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default TextFontPicker
