import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import FeatherIcon, { FeatherIconName } from 'feather-icons-react'

interface Props {
  editor: Editor
}

const TextAlignPicker = ({ editor }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLUListElement>(null)

  const currentAlign = editor.getAttributes('paragraph')?.textAlign ?? 'left'

  const applyAlignment = (alignment: 'left' | 'center' | 'right' | 'justify'): void => {
    editor.chain().focus().setTextAlign(alignment).run()
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
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-black"
        title="Text alignment"
      >
        <FeatherIcon icon="align-center" size={18} color={open ? 'white' : undefined} />
      </button>

      {open && (
        <ul
          ref={ref}
          className="right-16 bottom-14 z-10 absolute flex gap-1 bg-white shadow-lg mt-2 px-2 py-1 border-2 border-black rounded-2xl"
        >
          {['left', 'center', 'right', 'justify'].map((alignment) => (
            <li key={alignment}>
              <button
                onClick={() => applyAlignment(alignment as 'left' | 'center' | 'right' | 'justify')}
                className={`hover:bg-gray-100 px-2 py-1 rounded ${
                  currentAlign === alignment ? 'bg-primary' : ''
                }`}
                title={`Align ${alignment}`}
              >
                <FeatherIcon icon={`align-${alignment}` as FeatherIconName} size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default TextAlignPicker
