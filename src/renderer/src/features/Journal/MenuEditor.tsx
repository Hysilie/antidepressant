import { BubbleMenu, Editor } from '@tiptap/react'
import { FC } from 'react'

interface MenuEditorProps {
  editor: Editor
}

// TODO - Update styles later
const MenuEditor: FC<MenuEditorProps> = ({ editor }): JSX.Element => {
  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <input
          type="color"
          onInput={(event) =>
            editor
              .chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={editor.getAttributes('textStyle').color}
          data-testid="setColor"
        />
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
      </div>
    </BubbleMenu>
  )
}

export default MenuEditor
