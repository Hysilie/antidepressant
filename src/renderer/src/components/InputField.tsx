import { Field, ErrorMessage } from 'formik'
import clsx from 'clsx'
import { FC, HTMLInputTypeAttribute } from 'react'

type InputProps = {
  name: string
  label: string
  type?: HTMLInputTypeAttribute
}

const InputField: FC<InputProps> = ({ name, label, type = 'text' }): JSX.Element => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="mb-1 font-bold text-black">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        className={clsx(
          'px-4 py-2 border-none rounded-xl font-medium text-black',
          'focus:outline-none focus:ring-2 focus:ring-black',
          'transition duration-150 ease-in-out',
          'bg-white',
          'shadow-inner'
        )}
      />
      <ErrorMessage name={name}>
        {(msg) => <span className="mt-1 font-body font-semibold text-red-500 text-sm">{msg}</span>}
      </ErrorMessage>
    </div>
  )
}

export default InputField
