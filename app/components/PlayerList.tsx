import { FC } from 'react'
import { Player } from '../reducer'

interface Props {
  players: Player[]
  onRemovePlayer: (id: string) => void
}

const PlayerList: FC<Props> = ({ players, onRemovePlayer }) => (
  <div className="flex flex-wrap gap-2 overflow-y-auto content-baseline h-20">
    {players.map((player) => (
      <div key={player.id} className="badge gap-2 shadow-sm">
        <a href={`https://ratings.uschess.org/player/${player.id}`} target="_blank">
          {player.firstName} {player.lastName}
        </a>
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

export default PlayerList
