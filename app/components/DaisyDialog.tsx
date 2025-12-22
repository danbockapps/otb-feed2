import { FC, PropsWithChildren, ReactNode } from 'react'

interface Props {
  open: boolean
  actions: ReactNode
}

const DaisyDialog: FC<PropsWithChildren<Props>> = (props) => (
  <dialog className={`modal ${props.open ? 'modal-open' : ''}`}>
    <div className="modal-box">
      {props.children}
      <div className="modal-action">{props.actions}</div>
    </div>
  </dialog>
)

export default DaisyDialog
