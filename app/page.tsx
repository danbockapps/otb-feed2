'use client'

import { useCallback, useEffect, useReducer } from 'react'
import getPlayer from './lib/getPlayer'
import { initialState, reducer } from './reducer'

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchPlayerData = useCallback(() => {
    state.playerIds.forEach(async (id) => {
      const data = await getPlayer(id)
      console.log(`Player Data for ID ${id}:`, data)
    })
  }, [state.playerIds])

  useEffect(fetchPlayerData, [fetchPlayerData])

  return <main></main>
}
