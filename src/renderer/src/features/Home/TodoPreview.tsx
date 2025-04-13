import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { FC } from 'react'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { useTranslation } from 'react-i18next'
import { useTodo } from '@renderer/providers/Todo/useTodo'

type TodoPreviewProps = {
  content?: string
}

const TodoPreview: FC<TodoPreviewProps> = () => {
  const { pinnedTodo } = useTodo()
  const { t } = useTranslation('translation', { keyPrefix: 'todo' })

  const editor = useEditor({
    content: pinnedTodo?.todos,
    editable: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      Color.configure({
        types: ['textStyle']
      }),
      Placeholder.configure({
        placeholder: t('contentPlaceholder'),
        emptyEditorClass: 'is-editor-empty'
      }),
      TextStyle,
      Underline,
      FontFamily,
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ]
  })

  if (!editor) return null

  return (
    <div className="flex flex-col justify-start rounded-2xl w-36 min-h-48 max-h-48 overflow-y-scroll text-left">
      <EditorContent editor={editor} className="tiptaptodo previewtodo" />
      <div className="bottom-0 left-0 absolute bg-gradient-to-t from-white to-transparent rounded-b-2xl w-full h-10 pointer-events-none" />
    </div>
  )
}

export default TodoPreview
