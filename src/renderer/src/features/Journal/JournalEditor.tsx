import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuEditor from './MenuEditor'
import { usePage } from '@renderer/providers/Journal/Page/usePage'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { routes } from '@renderer/utils/Routes/routes'
import Container from '@renderer/components/Container'
import Header from '@renderer/components/Header'
import { useTranslation } from 'react-i18next'
import SvgButton from '@renderer/components/SvgButton'
import more from '../../assets/icons/more-vertical.svg'
import DropDownMenu from '@renderer/components/DropdownMenu'
import Button from '@renderer/components/Button'
import ConfirmDialog from '@renderer/components/ConfirmDialog'
import CodeBlock from '@tiptap/extension-code-block'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import FontFamily from '@tiptap/extension-font-family'
import { isDefined, isEmpty } from 'remeda'

const JournalEditor = (): JSX.Element => {
  const { update, title, content, save, remove, updatedAt, getImageData, pageId } = usePage()
  const { t } = useTranslation('translation', { keyPrefix: 'journal' })
  const [moreOptions, setMoreOptions] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const navigate = useNavigate()
  const newPage = !isDefined(updatedAt)

  const deletePage = useCallback(() => {
    remove()
    navigate(routes.journal)
  }, [navigate, remove])

  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        'data-image-id': {
          default: null,
          parseHTML: (element): string | null => element.getAttribute('data-image-id'),
          renderHTML: (attributes): Record<string, string> | object => {
            if (!attributes['data-image-id']) return {}
            return {
              'data-image-id': attributes['data-image-id']
            }
          }
        }
      }
    }
  })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      CodeBlock,
      TextStyle,
      Underline,
      FontFamily,
      CustomImage,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'link'
        }
      }),
      Color.configure({
        types: ['textStyle']
      }),
      Placeholder.configure({
        placeholder: t('contentPlaceholder'),
        emptyEditorClass: 'is-editor-empty'
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      update({ content: html })
    }
  })

  // Handle click events on links, preventing default behavior and invoking an IPC call to open external links.
  useEffect(() => {
    const handleLinkClick = (e: Event): void => {
      const mouseEvent = e as MouseEvent
      const target = mouseEvent.target as HTMLElement
      if (target.tagName === 'A') {
        mouseEvent.preventDefault()
        const href = target.getAttribute('href')
        if (href) {
          window.electron?.ipcRenderer?.invoke('open-external-link', href)
        }
      }
    }
    const editorRoot = document.querySelector('.tiptap')
    editorRoot?.addEventListener('click', handleLinkClick)

    return (): void => {
      editorRoot?.removeEventListener('click', handleLinkClick)
    }
  }, [])

  // Ensures that the editor content is synchronized with the content prop
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  // This useEffect hook updates the `src` attribute of all images. It retrieves the base64 image data
  // and the `getImageData` function.
  useEffect(() => {
    if (!editor) return
    const images = editor.view.dom.querySelectorAll('img[data-image-id]')
    images.forEach(async (img) => {
      const imageId = img.getAttribute('data-image-id')
      if (!imageId) return

      const base64 = await getImageData(imageId, pageId)
      if (base64) {
        img.setAttribute('src', base64)
      }
    })
  }, [editor, getImageData, pageId])

  return (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-x-hidden">
      <Header
        title={title ? title : t('page')}
        target={routes.journal}
        onClick={save}
        extraButton={
          <SvgButton src={more} alt={'more'} size={20} onClick={() => setMoreOptions(true)} />
        }
      />
      <DropDownMenu onClose={() => setMoreOptions(false)} visible={moreOptions}>
        <Button
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

          {newPage || showTitle ? (
            <input
              id="title"
              placeholder={t('titlePlaceholder')}
              value={title ?? undefined}
              onChange={(e) => update({ title: e.target.value })}
              className="border-gray-200 border-b outline-none focus:ring-0 focus:ring-none w-full text-lg"
            />
          ) : null}
          <EditorContent
            editor={editor}
            className="tiptap"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === '/') {
                e.preventDefault()
                editor?.chain().focus().toggleCodeBlock().run()
              }
            }}
          />
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
        onConfirm={deletePage}
      />
    </Container>
  )
}

export default JournalEditor
