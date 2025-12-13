import { PlayerDTO } from './types/dto'

interface State {
  playerIds: string[]
  dtos: Record<string, PlayerDTO>
}

export const initialState: State = {
  playerIds: ['12663913', '12659954'],
  dtos: {},
}

type Action = { type: 'ADD_PERFORMANCES'; payload: { playerId: string; dto: PlayerDTO } }
// | { type: 'ADD_PLAYER'; payload: Player }
// | { type: 'REMOVE_PLAYER'; payload: string }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PERFORMANCES':
      return { ...state, dtos: { ...state.dtos, [action.payload.playerId]: action.payload.dto } }
    default:
      return state
  }
}
