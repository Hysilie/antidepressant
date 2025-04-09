import { useRef, useEffect, FC, PropsWithChildren } from 'react'

type DropDownMenuProps = {
  visible: boolean
  onClose: () => void
}

const DropDownMenu: FC<PropsWithChildren<DropDownMenuProps>> = ({
  visible,
  onClose,
  children
}): JSX.Element | null => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: { target: unknown }): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose, visible])

  return visible ? (
    <div
      ref={ref}
      className="top-10 right-5 z-30 absolute flex flex-col flex-1 bg-primary mt-1 mr-2 p-2 border-2 border-black rounded-lg"
    >
      {children}
    </div>
  ) : null
}

export default DropDownMenu
