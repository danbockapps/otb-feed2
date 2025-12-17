import { PlayerDTO } from './types/dto'

export interface Player {
  id: string
  firstName: string
  lastName: string
}

interface State {
  players: Player[]
  dtos: Record<string, PlayerDTO>
}

export const initialState: State = {
  players: [],
  dtos: {},
}

type Action =
  | { type: 'ADD_PERFORMANCES'; payload: { playerId: string; dto: PlayerDTO } }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'RESET' }
  | { type: 'REMOVE_PLAYER'; payload: string }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PERFORMANCES':
      return { ...state, dtos: { ...state.dtos, [action.payload.playerId]: action.payload.dto } }
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }
    case 'REMOVE_PLAYER':
      return {
        players: state.players.filter((p) => p.id !== action.payload),
        dtos: Object.fromEntries(
          Object.entries(state.dtos).filter(([id]) => id !== action.payload),
        ),
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
