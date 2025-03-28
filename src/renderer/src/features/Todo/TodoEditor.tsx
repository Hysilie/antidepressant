import PreviousButton from '@renderer/components/PreviousButton'
import { useTask } from '@renderer/providers/Todo/Task/useTask'
import Paragraph from '@tiptap/extension-paragraph'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'
import { useDebouncer } from '@renderer/utils/useDebouncer'

const TodoEditor = (): JSX.Element => {
  const { title, todos, update, save, remove } = useTask()
  const navigate = useNavigate()

  const debouncedUpdate = useDebouncer((html: string) => {
    update({ todos: html })
  })

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],
    content: todos,
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && todos && editor.getHTML() !== todos) {
      editor.commands.setContent(todos)
    }
  }, [editor, todos])

  return (
    <div>
      <PreviousButton
        action={() => {
          save()
          navigate(routes.todo)
        }}
      />

      <input
        id="title"
        placeholder="Title…"
        value={title ?? undefined}
        onChange={(e) => update({ title: e.target.value })}
      />

      <div className="control-group">
        <div className="button-group">
          <button
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
            className={editor?.isActive('taskList') ? 'is-active' : ''}
          >
            Toggle task list
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
          >
            Add task
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
      <EditorContent editor={editor} className="tiptap" />
      <button
        onClick={() => {
          remove()
          navigate(routes.todo)
        }}
      >
        delete todo
      </button>
    </div>
  )
}

export default TodoEditor
