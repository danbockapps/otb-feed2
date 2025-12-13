'use client'

import { useCallback, useEffect, useReducer } from 'react'
import getPlayer from './lib/getPlayer'
import { initialState, reducer } from './reducer'

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)

  const fetchPlayerData = useCallback(() => {
    state.playerIds.forEach(async (id) => {
      const data = await getPlayer(id)
      dispatch({ type: 'ADD_PERFORMANCES', payload: { playerId: id, dto: data } })
    })
  }, [state.playerIds])

  useEffect(fetchPlayerData, [fetchPlayerData])

  // const events = Object.entries(state.dtos).reduce<IEvent>((acc, dto) => {}, {})

  return <main></main>
}
