import { Editor } from '@tiptap/react'
import { FC } from 'react'
import FeatherIcon from 'feather-icons-react'
import TextColorPicker from './TextColorPicker'
import { insertImageWithId } from '@renderer/utils/useImageUploader'
import { usePage } from '@renderer/providers/Journal/Page/usePage'
import TextFontPicker from './TextFontPicker'
import TextAlignPicker from './TextAlignPicker'

interface MenuEditorProps {
  editor: Editor
}

const MenuEditor: FC<MenuEditorProps> = ({ editor }) => {
  const { storeImage } = usePage()

  const handleImageInsert = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const file = event.target.files?.[0]
      if (!file || !editor) return
      await insertImageWithId(file, editor, storeImage)
    } catch (error) {
      console.error('Error inserting image:', error)
    }
  }

  return (
    <div className="flex justify-between items-center bg-primary px-3 py-2 border-2 border-black rounded-2xl w-full">
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

      <TextAlignPicker editor={editor} />
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'text-white' : 'text-black'}
      >
        <FeatherIcon icon="code" size={18} />
      </button>

      <input type="file" id="image-upload" accept="image/*" hidden onChange={handleImageInsert} />
      <label htmlFor="image-upload" className="cursor-pointer">
        <FeatherIcon icon="image" size={18} />
      </label>
      <TextColorPicker editor={editor} />
    </div>
  )
}

export default MenuEditor
