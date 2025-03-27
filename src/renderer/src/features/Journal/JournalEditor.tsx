import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuEditor from './MenuEditor'
import PreviousButton from '@renderer/components/PreviousButton'
import { usePage } from '@renderer/providers/Journal/Page/usePage'
import { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router'
import { routes } from '@renderer/utils/Routes/routes'

const JournalEditor = (): JSX.Element => {
  const { update, title, content, save, remove } = usePage()
  const navigate = useNavigate()
  const debouncedUpdate = useMemo(
    () =>
      debounce((html: string) => {
        update({ content: html })
      }, 300),
    [update]
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ['textStyle']
      }),
      Placeholder.configure({
        placeholder: 'Start to write…',
        emptyEditorClass: 'is-editor-empty'
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return (
    <div className="journal-container">
      <PreviousButton
        action={() => {
          save()
          navigate(routes.journal)
        }}
      />
      <input
        id="title"
        placeholder="Title…"
        value={title ?? undefined}
        onChange={(e) => update({ title: e.target.value })}
      />

      {!!editor && <MenuEditor {...{ editor }} />}
      <EditorContent editor={editor} className="tiptap" />
      <button
        onClick={() => {
          remove()
          navigate(routes.journal)
        }}
      >
        delete doc
      </button>
    </div>
  )
}

export default JournalEditor
