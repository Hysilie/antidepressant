import { useTask } from '@renderer/providers/Todo/Task/useTask'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

import { EditorContent, useEditor } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router-dom'
import Button from '@renderer/components/Button'
import Container from '@renderer/components/Container'
import DropDownMenu from '@renderer/components/DropdownMenu'
import Header from '@renderer/components/Header'
import SvgButton from '@renderer/components/SvgButton'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from '@renderer/components/ConfirmDialog'
import more from '../../assets/icons/more-vertical.svg'
import { isDefined } from 'remeda'
import MenuEditor from './MenuEditor'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Loader from '@renderer/components/Loader'
import FeatherIcon from 'feather-icons-react'
import { useTodo } from '@renderer/providers/Todo/useTodo'

const TodoEditor = (): JSX.Element => {
  const { pinATodo, pinnedTodo } = useTodo()
  const { title, updatedAt, todos, update, save, remove, loading, todolistId } = useTask()
  const navigate = useNavigate()
  const { t } = useTranslation('translation', { keyPrefix: 'todo' })
  const [moreOptions, setMoreOptions] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const isNewTodo = !isDefined(updatedAt)

  const deleteTodo = useCallback(() => {
    remove()
    navigate(routes.todo)
  }, [navigate, remove])

  const editor = useEditor({
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
    ],
    content: todos,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      update({ todos: html })
    }
  })

  useEffect(() => {
    if (editor && todos && editor.getHTML() !== todos) {
      editor.commands.setContent(todos)
    }
  }, [editor, todos])

  return loading ? (
    <Loader />
  ) : (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-x-hidden">
      <Header
        title={title ? title : t('todo')}
        target={routes.todo}
        onClick={save}
        extraButton={
          <SvgButton src={more} alt={'more'} size={20} onClick={() => setMoreOptions(true)} />
        }
      />
      <DropDownMenu onClose={() => setMoreOptions(false)} visible={moreOptions}>
        {!isNewTodo && (
          <>
            <Button
              iconLeft={
                <FeatherIcon
                  icon="bookmark"
                  size={16}
                  fill={pinnedTodo?.id === todolistId ? 'black' : undefined}
                />
              }
              mode="inline"
              label={pinnedTodo?.id === todolistId ? t('unpinned') : t('pinned')}
              type="button"
              onClick={() => {
                pinATodo(todolistId)
                setMoreOptions(false)
              }}
              style={{ fontSize: 'small' }}
            />
            <Button
              iconLeft={<FeatherIcon icon="edit-3" size={16} />}
              mode="inline"
              label={t('modify')}
              type="button"
              onClick={() => {
                setShowTitle((prev) => !prev)
                setMoreOptions(false)
              }}
              style={{ fontSize: 'small' }}
            />
            <div className="mb-2 border-b border-black w-full h-2" />
          </>
        )}
        <Button
          mode="inline"
          label={t('extraButtons.remove')}
          type="button"
          onClick={() => setOpenConfirmDialog(true)}
          style={{ fontSize: 'small' }}
        />
      </DropDownMenu>
      <div className="flex flex-col flex-grow pt-2 rounded-lg w-full overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {updatedAt && (
            <p className="mb-1 text-gray-300 text-xs lowercase">
              {t('lastedit', {
                time: updatedAt.toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              })}
            </p>
          )}

          {isNewTodo || showTitle ? (
            <input
              id="title"
              placeholder={t('titlePlaceholder')}
              value={title ?? undefined}
              onChange={(e) => update({ title: e.target.value })}
              className="mb-2 border-gray-200 border-b outline-none focus:ring-0 focus:ring-none w-full text-lg"
            />
          ) : null}
          <EditorContent editor={editor} className="tiptaptodo" />
        </div>
        <div className="p-2">{!!editor && <MenuEditor {...{ editor }} />}</div>
      </div>

      <ConfirmDialog
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        title={t('dialog.title')}
        description={t('dialog.content')}
        confirmLabel={t('dialog.confirm')}
        cancelLabel={t('dialog.cancel')}
        onConfirm={deleteTodo}
      />
    </Container>
  )
}

export default TodoEditor
