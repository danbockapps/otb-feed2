import { FC } from 'react'
import { Player } from '../reducer'

interface Props {
  players: Player[]
  onRemovePlayer: (id: string) => void
}

const PlayerList: FC<Props> = ({ players, onRemovePlayer }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {players.map((player) => (
        <div key={player.id} className="badge badge-primary gap-2 cursor-pointer">
          {player.firstName} {player.lastName}
          <button
            onClick={() => onRemovePlayer(player.id)}
            className="btn btn-circle btn-xs btn-ghost"
            aria-label={`Remove ${player.firstName} ${player.lastName}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default PlayerList
