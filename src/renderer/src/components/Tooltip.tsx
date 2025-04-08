import { FC, PropsWithChildren, ReactElement } from 'react'

type ToolTipProps = {
  children: ReactElement
  label: string
  right?: boolean
}

const LEFT = ' -translate-x-[110%]'
const RIGHT = 'translate-x-[10%]'

const Tooltip: FC<PropsWithChildren<ToolTipProps>> = ({ children, label, right }) => {
  return (
    <div className="group relative">
      {children}

      <div
        className={`bottom-full absolute bg-white opacity-0 group-hover:opacity-100 group-hover:delay-700  py-[2px] px-3 border-2 border-black rounded-l-xl rounded-tr-xl text-black text-xs whitespace-nowrap transition-opacity duration-500 ease-in-out ${(right && RIGHT) ?? LEFT}`}
      >
        {label}
      </div>
    </div>
  )
}

export default Tooltip
