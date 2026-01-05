import { FC } from 'react'

interface Props {
  message: string
  close: () => void
}

const Toast: FC<Props> = (props) => (
  <div className="toast toast-bottom toast-center">
    <div className="alert alert-error">
      <span>{props.message}</span>
      <button className="btn btn-circle btn-xs btn-ghost" onClick={props.close}>
        ✕
      </button>
    </div>
  </div>
)

export default Toast
