import { Editor } from '@tiptap/react'
import imageCompression from 'browser-image-compression'
import { v4 as uuidv4 } from 'uuid'

// Tiptap doesn't handle large Base64 strings well, so we upload the image to a storage service (Firebase here)
// and use the URL of the uploaded image instead.

/**
 * Compresses an image file to reduce its size and dimensions.
 * The compression process reduces the file size to a maximum of 0.1 MB
 * @param file - The image file to be compressed.
 * @returns A promise that resolves to the compressed image file.
 */
const compressImage = async (file: File): Promise<File> => {
  return await imageCompression(file, {
    useWebWorker: false,
    maxSizeMB: 0.1,
    maxWidthOrHeight: 300,
    fileType: 'image/webp'
  })
}

/**
 * Converts a File object to a Base64-encoded string.
 */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (): void => resolve(reader.result as string)
    reader.onerror = (err): void => reject(err)
  })

/**
 * Inserts an image into the editor with a unique identifier.
 *
 * This function compresses the provided image file, converts to Base64 string,
 * generates a unique ID for the image, stores the image using the provided `storeImage` function,
 * and then inserts the image into the editor with the generated ID as a custom attribute.
 *
 * @param file - The image file to be uploaded and inserted.
 * @param editor - The editor instance where the image will be inserted.
 * @param storeImage - A function that stores the image data and associates it with a unique ID.
 *                     It takes the image ID and Base64 data as arguments and returns a Promise.
 *
 */
export const insertImageWithId = async (
  file: File,
  editor: Editor,
  storeImage: (id: string, data: string) => Promise<void>
): Promise<void> => {
  try {
    const compressed = await compressImage(file)
    const base64 = await fileToBase64(compressed)
    const imageId = uuidv4()

    await storeImage(imageId, base64)

    editor
      .chain()
      .focus()
      .setImage({
        src: '',
        'data-image-id': imageId
      } as { src: string; 'data-image-id': string })
      .run()
  } catch (err) {
    console.error('Erreur insertion image:', err)
  }
}
