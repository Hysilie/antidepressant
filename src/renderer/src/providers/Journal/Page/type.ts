export interface PageContextData {
  title: string
  content: string
  updatedAt: Date | undefined
  pageId: string
  update: (fields: Partial<{ title: string; content: string }>) => void
  save: () => Promise<void>
  remove: () => Promise<void>
  storeImage: (imageId: string, base64: string) => Promise<void>
  getImageData: (imageId: string, pageId: string) => Promise<string | undefined>
  isSaved: boolean
}
