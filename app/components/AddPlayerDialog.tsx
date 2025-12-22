import { FC, useEffect, useRef, useState } from 'react'
import DaisyDialog from './DaisyDialog'

interface Props {
  addPlayer: (playerId: string) => void
}

const AddPlayerDialog: FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [playerId, setPlayerId] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const reset = () => {
    setOpen(false)
    setPlayerId('')
  }

  const addPlayer = (playerId: string) => {
    props.addPlayer(playerId)
    reset()
  }

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        Add player
      </button>
      <DaisyDialog
        {...{ open }}
        actions={
          <>
            <button className="btn" onClick={reset}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => addPlayer(playerId)}>
              Add
            </button>
          </>
        }
      >
        <h3 className="font-bold text-lg">Add Player</h3>
        <p className="py-4">Enter USCF ID (usually 8-digit number)</p>
        <input
          ref={inputRef}
          type="text"
          className="input input-accent w-full"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addPlayer(playerId)
            }
          }}
        />
      </DaisyDialog>
    </>
  )
}

export default AddPlayerDialog
