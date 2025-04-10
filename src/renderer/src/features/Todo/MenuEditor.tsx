import { Editor } from '@tiptap/react'
import { FC } from 'react'
import FeatherIcon from 'feather-icons-react'

import TextFontPicker from '../Journal/TextFontPicker'
import TextColorPicker from '../Journal/TextColorPicker'

interface MenuEditorProps {
  editor: Editor
}

const MenuEditor: FC<MenuEditorProps> = ({ editor }) => {
  return (
    <div className="flex justify-between items-center bg-primary px-3 py-2 rounded-2xl w-full">
      <TextFontPicker editor={editor} />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'text-white' : 'text-black'}
      >
        <FeatherIcon icon="bold" size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'text-white' : 'text-black'}
      >
        <FeatherIcon icon="italic" size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'text-white' : 'text-black'}
      >
        <FeatherIcon icon="underline" size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FeatherIcon icon="list" size={18} />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        className={editor?.isActive('taskList') ? 'text-white' : 'text-black'}
      >
        <FeatherIcon icon="check-square" size={18} />
      </button>
      <button
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'taskList',
              content: [
                {
                  type: 'taskItem',
                  attrs: { checked: false },
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: ' '
                        }
                      ]
                    }
                  ]
                }
              ]
            })
            .run()
        }}
        className="text-black"
      >
        <FeatherIcon icon="plus-square" size={18} />
      </button>

      <TextColorPicker editor={editor} />
    </div>
  )
}

export default MenuEditor
